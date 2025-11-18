import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class FileHandler {
  private static TEMP_DIR = path.join(process.cwd(), "temp");

  static async init() {
    try {
      await fs.mkdir(this.TEMP_DIR, { recursive: true });
      console.log("✅ Temp directory initialized");
    } catch (error) {
      console.error("Failed to create temp directory:", error);
    }
  }

  static getTempPath(extension: string = ".json"): string {
    const filename = `${uuidv4()}${extension}`;
    return path.join(this.TEMP_DIR, filename);
  }

  static async saveFile(
    buffer: Buffer,
    extension: string = ".json"
  ): Promise<string> {
    const filePath = this.getTempPath(extension);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  static async cleanup(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      console.log(`🗑️  Cleaned up: ${filePath}`);
    } catch (error) {
      console.error(`Failed to cleanup ${filePath}:`, error);
    }
  }
}
