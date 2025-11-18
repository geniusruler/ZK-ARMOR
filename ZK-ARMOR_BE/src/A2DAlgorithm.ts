import * as tf from "@tensorflow/tfjs-node";
import { A2DConfig, A2DVerificationResult } from "./types";

export class A2DAlgorithm {
  private config: A2DConfig;

  constructor(config: Partial<A2DConfig> = {}) {
    this.config = {
      epsilon: config.epsilon ?? 0.03,
      sapThreshold: config.sapThreshold ?? 0.5,
      attackIterations: config.attackIterations ?? 10,
      alphaStep: config.alphaStep ?? 0.01,
    };
  }

  async verify(
    targetModel: tf.LayersModel,
    referenceModel: tf.LayersModel,
    cleanDataset: { images: tf.Tensor4D; labels: tf.Tensor2D }
  ): Promise<A2DVerificationResult> {
    console.log("[A2D] Generating adversarial examples...");

    const adversarialExamples = await this.generatePGDAttack(
      referenceModel,
      cleanDataset.images,
      cleanDataset.labels
    );

    console.log("[A2D] Computing SAP score...");
    const sapScore = this.computeSAP(
      targetModel,
      cleanDataset.images,
      adversarialExamples
    );

    const cleanAccuracy = this.evaluateAccuracy(
      targetModel,
      cleanDataset.images,
      cleanDataset.labels
    );

    const advAccuracy = this.evaluateAccuracy(
      targetModel,
      adversarialExamples,
      cleanDataset.labels
    );

    const accuracyDrop = cleanAccuracy - advAccuracy;
    const isPoisoned = sapScore > this.config.sapThreshold;
    const confidence = this.computeConfidence(sapScore);

    adversarialExamples.dispose();

    return {
      isPoisoned,
      sapScore,
      confidence,
      details: {
        cleanAccuracy,
        adversarialAccuracy: advAccuracy,
        accuracyDrop,
      },
    };
  }

  private async generatePGDAttack(
    model: tf.LayersModel,
    images: tf.Tensor4D,
    labels: tf.Tensor2D
  ): Promise<tf.Tensor4D> {
    let advImages = images.clone();

    for (let i = 0; i < this.config.attackIterations; i++) {
      const newAdvImages = tf.tidy(() => {
        const grads = tf.grad((x: tf.Tensor) => {
          const pred = model.predict(x as tf.Tensor4D) as tf.Tensor2D;
          return tf.losses.softmaxCrossEntropy(labels, pred);
        })(advImages);

        const perturbation = tf.mul(
          this.config.alphaStep,
          tf.sign(grads as tf.Tensor4D)
        );
        const updated = tf.add(advImages, perturbation);
        const eta = tf.sub(updated, images);
        const clippedEta = tf.clipByValue(
          eta,
          -this.config.epsilon,
          this.config.epsilon
        );

        return tf.clipByValue(tf.add(images, clippedEta), 0, 1) as tf.Tensor4D;
      });

      advImages.dispose();
      advImages = newAdvImages;
    }

    return advImages;
  }

  private computeSAP(
    model: tf.LayersModel,
    cleanImages: tf.Tensor4D,
    adversarialImages: tf.Tensor4D
  ): number {
    return tf.tidy(() => {
      const cleanPreds = model.predict(cleanImages) as tf.Tensor2D;
      const advPreds = model.predict(adversarialImages) as tf.Tensor2D;
      const diff = tf.abs(tf.sub(cleanPreds, advPreds));
      return tf.mean(diff).dataSync()[0];
    });
  }

  private evaluateAccuracy(
    model: tf.LayersModel,
    images: tf.Tensor4D,
    labels: tf.Tensor2D
  ): number {
    return tf.tidy(() => {
      const predictions = model.predict(images) as tf.Tensor2D;
      const predictedClasses = predictions.argMax(-1);
      const trueClasses = labels.argMax(-1);
      const correct = tf.equal(predictedClasses, trueClasses);
      return tf.mean(correct.cast("float32")).dataSync()[0];
    });
  }

  private computeConfidence(sapScore: number): number {
    const distance = Math.abs(sapScore - this.config.sapThreshold);
    const maxDistance = Math.max(
      this.config.sapThreshold,
      1 - this.config.sapThreshold
    );
    return Math.min(distance / maxDistance, 1.0);
  }
}

export function generateCleanDataset(
  numSamples: number = 100,
  imageSize: number = 224,
  numClasses: number = 10
): { images: tf.Tensor4D; labels: tf.Tensor2D } {
  const images = tf.randomUniform([numSamples, imageSize, imageSize, 3]);
  const labelIndices = tf.randomUniform([numSamples], 0, numClasses, "int32");
  const labels = tf.oneHot(labelIndices, numClasses) as tf.Tensor2D;
  labelIndices.dispose();
  return { images, labels };
}

export async function loadReferenceModel(): Promise<tf.LayersModel> {
  console.log("📥 Loading reference model...");
  const model = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
  );
  console.log("✅ Reference model loaded");
  return model;
}
