// server.ts - Main Express server for AI Model Registry with A2D Integration

import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import crypto from "crypto";
import FormData from "form-data";

// type RequestWithFile = Request & { file?: Express.Multer.File };

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3116;

// ✅ A2D API Configuration
const A2D_API_URL = process.env.A2D_API_URL || "http://localhost:3001";

// Multer configuration for file uploads
const TEMP_DIR = path.join(__dirname, "../temp");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.jsdelivr.net",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://api.midnight.network",
          "wss://midnight.network",
          "https://cdn.jsdelivr.net",
          A2D_API_URL, // ✅ Allow A2D API
        ],
        workerSrc: ["'self'", "blob:"],
      },
    },
  })
);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

// ============================================
// ✅ A2D VERIFICATION ROUTES
// ============================================

// API: Verify model with A2D (file upload)
// app.post(
//   "/api/a2d/verify",
//   upload.single("model"),
//   async (req: Request, res: Response) => {
//     let tempPath: string | null = null;

//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           error: "No model file provided",
//         });
//       }

//       tempPath = req.file.path;
//       const ownerId = req.body.ownerId || "anonymous";

//       // console.log(`📤 Forwarding model to A2D API: ${req.file.originalname}`);

//       // Forward file to A2D API
//       const FormData = (await import("form-data")).default;
//       const formData = new FormData();
//       formData.append("model", fs.createReadStream(tempPath));
//       formData.append("ownerId", ownerId);

//       const fetch = (await import("node-fetch")).default;
//       const response = await fetch(`${A2D_API_URL}/api/verify`, {
//         method: "POST",
//         body: formData as any,
//         headers: formData.getHeaders(),
//       });

//       const result = await response.json();

//       console.log(
//         `${result.success ? "✅" : "❌"} A2D Result:`,
//         result.result?.pass ? "PASSED" : "FAILED"
//       );

//       res.json(result);
//     } catch (error: any) {
//       console.error("❌ A2D verification error:", error);
//       res.status(500).json({
//         success: false,
//         error: "A2D verification failed",
//         message: error.message,
//       });
//     } finally {
//       // Cleanup temp file
//       if (tempPath && fs.existsSync(tempPath)) {
//         try {
//           fs.unlinkSync(tempPath);
//         } catch (err) {
//           console.error("Failed to delete temp file:", err);
//         }
//       }
//     }
//   }
// );

app.post(
  "/api/a2d/verify",
  upload.single("model"),
  async (req: any, res: Response) => {
    let tempPath: string | null = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No model file provided",
        });
      }

      tempPath = req.file.path;
      const ownerId = req.body.ownerId || "anonymous";

      console.log(`📤 Forwarding model to A2D API: ${req.file.originalname}`);

      // Create FormData
      const formData = new FormData();
      formData.append("model", fs.createReadStream(tempPath));
      formData.append("ownerId", ownerId);

      // Forward to A2D API
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(`${A2D_API_URL}/api/verify`, {
        method: "POST",
        body: formData as any,
        headers: formData.getHeaders(),
      });

      const result = await response.json();

      res.json(result);
    } catch (error: any) {
      console.error("❌ A2D verification error:", error);
      res.status(500).json({
        success: false,
        error: "A2D verification failed",
        message: error.message,
      });
    } finally {
      // Cleanup
      if (tempPath && fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
        } catch (err) {
          console.error("Failed to delete temp file:", err);
        }
      }
    }
  }
);

// API: Check A2D service health
app.get("/api/a2d/health", async (req: Request, res: Response) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${A2D_API_URL}/health`);
    const data = await response.json();

    res.json({
      a2dServiceOnline: response.ok,
      a2dUrl: A2D_API_URL,
      a2dStatus: data,
    });
  } catch (error: any) {
    res.json({
      a2dServiceOnline: false,
      a2dUrl: A2D_API_URL,
      error: error.message,
    });
  }
});

// ============================================
// EXISTING ROUTES (Keep as is)
// ============================================

// Home page
app.get("/", (req: Request, res: Response) => {
  res.render("index", {
    title: "AI Model Trust Registry",
    walletConnected: false,
    walletAddress: "",
    a2dApiUrl: A2D_API_URL,
  });
});

// API: Get registry statistics
app.get("/api/stats", async (req: Request, res: Response) => {
  try {
    const stats = {
      totalModels: 42,
      verifiedModels: 38,
      totalAttestations: 156,
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// API: Get model information by hash
app.get("/api/model/:hash", async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
      return res.status(400).json({ error: "Invalid model hash format" });
    }

    const modelInfo = {
      modelHash: hash,
      creatorId: "midnight1abc...xyz",
      registeredAt: Date.now() - 86400000,
      isVerified: true,
      attestationCount: 3,
      description: "Sample AI model",
    };

    res.json(modelInfo);
  } catch (error) {
    console.error("Error fetching model:", error);
    res.status(500).json({ error: "Failed to fetch model information" });
  }
});

// API: Get all registered models
app.get("/api/models", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const models = Array.from({ length: 5 }, (_, i) => ({
      modelHash: `${i.toString(16).padStart(64, "0")}`,
      creatorId: `creator${i}`,
      registeredAt: Date.now() - i * 86400000,
      isVerified: i % 2 === 0,
      attestationCount: i * 2,
    }));

    res.json({
      page,
      limit,
      total: 42,
      models,
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to fetch models list" });
  }
});

// API: Register model
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { modelHash, zkProof, creatorName, description, a2dCertificate } =
      req.body;

    if (!modelHash || !zkProof) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!/^[a-f0-9]{64}$/i.test(modelHash)) {
      return res.status(400).json({ error: "Invalid model hash format" });
    }

    console.log("Registering model:", {
      modelHash,
      creatorName,
      hasA2DCert: !!a2dCertificate,
    });

    res.json({
      success: true,
      modelHash,
      txHash: "0x" + Math.random().toString(16).slice(2),
      message: "Model registered successfully",
      a2dVerified: !!a2dCertificate,
    });
  } catch (error) {
    console.error("Error registering model:", error);
    res.status(500).json({ error: "Failed to register model" });
  }
});

// API: Verify model (read-only query)
app.post("/api/verify", async (req: Request, res: Response) => {
  try {
    const { modelHash } = req.body;

    if (!modelHash || !/^[a-f0-9]{64}$/i.test(modelHash)) {
      return res.status(400).json({ error: "Invalid model hash format" });
    }

    const isVerified = Math.random() > 0.3;

    res.json({
      isVerified,
      modelHash,
      modelInfo: isVerified
        ? {
            creatorId: "midnight1abc...xyz",
            registeredAt: Date.now() - 86400000,
            attestationCount: 3,
          }
        : null,
    });
  } catch (error) {
    console.error("Error verifying model:", error);
    res.status(500).json({ error: "Failed to verify model" });
  }
});

// API: Add attestation
app.post("/api/attest", async (req: Request, res: Response) => {
  try {
    const { modelHash, auditorProof } = req.body;

    if (!modelHash || !auditorProof) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Adding attestation for model:", modelHash);

    res.json({
      success: true,
      modelHash,
      txHash: "0x" + Math.random().toString(16).slice(2),
      message: "Attestation added successfully",
    });
  } catch (error) {
    console.error("Error adding attestation:", error);
    res.status(500).json({ error: "Failed to add attestation" });
  }
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Server error:", err);
  res.status(500).render("error", {
    title: "Server Error",
    message: "An unexpected error occurred.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 AI Model Registry server running on http://localhost:${PORT}`
  );
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🌙 Midnight Network: ${process.env.MIDNIGHT_NETWORK || "devnet"}`
  );
  console.log(`🛡️  A2D Verification API: ${A2D_API_URL}`);
});

export default app;
// // server.ts - Main Express server for AI Model Registry

// import express, { Request, Response } from "express";
// import path from "path";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import { config } from "dotenv";
// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import crypto from "crypto";
// // Load environment variables
// config();

// const app = express();
// const PORT = process.env.PORT || 3116;

// const A2D_API_URL = process.env.A2D_API_URL || "http://localhost:3001";

// // Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "'unsafe-eval'",
//           "https://cdn.jsdelivr.net",
//         ],
//         scriptSrcElem: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://cdn.jsdelivr.net",
//         ],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         imgSrc: ["'self'", "data:", "https:"],
//         connectSrc: [
//           "'self'",
//           "https://api.midnight.network",
//           "wss://midnight.network",
//           "https://cdn.jsdelivr.net",
//           A2D_API_URL, // A2D integration
//         ],
//         workerSrc: ["'self'", "blob:"],
//       },
//     },
//   })
// );
// app.use(cors());
// app.use(express.json({ limit: "1mb" })); // We only accept small payloads (hashes, not files!)
// app.use(express.urlencoded({ extended: true }));
// // app.use(compression());
// app.use(express.static(path.join(__dirname, "../public")));

// // View engine setup
// app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");

// // Routes

// // Home page
// app.get("/", (req: Request, res: Response) => {
//   res.render("index", {
//     title: "AI Model Trust Registry",
//     walletConnected: false,
//     walletAddress: "",
//   });
// });

// // API: Get registry statistics
// app.get("/api/stats", async (req: Request, res: Response) => {
//   try {
//     // In production, this would query the Midnight smart contract
//     // For demo, returning mock data
//     const stats = {
//       totalModels: 42,
//       verifiedModels: 38,
//       totalAttestations: 156,
//     };

//     res.json(stats);
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ error: "Failed to fetch statistics" });
//   }
// });

// // API: Get model information by hash
// app.get("/api/model/:hash", async (req: Request, res: Response) => {
//   try {
//     const { hash } = req.params;

//     // Validate hash format
//     if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
//       return res.status(400).json({ error: "Invalid model hash format" });
//     }

//     // In production, query the smart contract
//     // For demo, returning mock data
//     const modelInfo = {
//       modelHash: hash,
//       creatorId: "midnight1abc...xyz",
//       registeredAt: Date.now() - 86400000, // 1 day ago
//       isVerified: true,
//       attestationCount: 3,
//       description: "Sample AI model",
//     };

//     res.json(modelInfo);
//   } catch (error) {
//     console.error("Error fetching model:", error);
//     res.status(500).json({ error: "Failed to fetch model information" });
//   }
// });

// // API: Get all registered models (paginated)
// app.get("/api/models", async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const search = (req.query.search as string) || "";

//     // In production, query the smart contract with pagination
//     // For demo, returning mock data
//     const models = Array.from({ length: 5 }, (_, i) => ({
//       modelHash: `${i.toString(16).padStart(64, "0")}`,
//       creatorId: `creator${i}`,
//       registeredAt: Date.now() - i * 86400000,
//       isVerified: i % 2 === 0,
//       attestationCount: i * 2,
//     }));

//     res.json({
//       page,
//       limit,
//       total: 42,
//       models,
//     });
//   } catch (error) {
//     console.error("Error fetching models:", error);
//     res.status(500).json({ error: "Failed to fetch models list" });
//   }
// });

// // API: Register model (this would interact with smart contract)
// app.post("/api/register", async (req: Request, res: Response) => {
//   try {
//     const { modelHash, zkProof, creatorName, description } = req.body;

//     // Validate inputs
//     if (!modelHash || !zkProof) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     if (!/^[a-f0-9]{64}$/i.test(modelHash)) {
//       return res.status(400).json({ error: "Invalid model hash format" });
//     }

//     // In production:
//     // 1. Verify ZK proof
//     // 2. Call smart contract's registerModel function
//     // 3. Wait for transaction confirmation
//     // 4. Return transaction hash

//     // For demo, simulating success
//     console.log("Registering model:", { modelHash, creatorName });

//     res.json({
//       success: true,
//       modelHash,
//       txHash: "0x" + Math.random().toString(16).slice(2),
//       message: "Model registered successfully",
//     });
//   } catch (error) {
//     console.error("Error registering model:", error);
//     res.status(500).json({ error: "Failed to register model" });
//   }
// });

// // API: Verify model (read-only query)
// app.post("/api/verify", async (req: Request, res: Response) => {
//   try {
//     const { modelHash } = req.body;

//     // Validate hash
//     if (!modelHash || !/^[a-f0-9]{64}$/i.test(modelHash)) {
//       return res.status(400).json({ error: "Invalid model hash format" });
//     }

//     // In production, query the smart contract
//     // For demo, simulating verification
//     const isVerified = Math.random() > 0.3; // 70% verified rate for demo

//     res.json({
//       isVerified,
//       modelHash,
//       modelInfo: isVerified
//         ? {
//             creatorId: "midnight1abc...xyz",
//             registeredAt: Date.now() - 86400000,
//             attestationCount: 3,
//           }
//         : null,
//     });
//   } catch (error) {
//     console.error("Error verifying model:", error);
//     res.status(500).json({ error: "Failed to verify model" });
//   }
// });

// // API: Add attestation
// app.post("/api/attest", async (req: Request, res: Response) => {
//   try {
//     const { modelHash, auditorProof } = req.body;

//     if (!modelHash || !auditorProof) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // In production, verify auditor credentials and call smart contract
//     console.log("Adding attestation for model:", modelHash);

//     res.json({
//       success: true,
//       modelHash,
//       txHash: "0x" + Math.random().toString(16).slice(2),
//       message: "Attestation added successfully",
//     });
//   } catch (error) {
//     console.error("Error adding attestation:", error);
//     res.status(500).json({ error: "Failed to add attestation" });
//   }
// });

// // Health check
// app.get("/health", (req: Request, res: Response) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// ////////////////////////////////////////////
// // A2D
// ////////////////////////////////////////////

// const TEMP_DIR = path.join(__dirname, "../temp");
// if (!fs.existsSync(TEMP_DIR)) {
//   fs.mkdirSync(TEMP_DIR, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, TEMP_DIR);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${uuidv4()}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
// });
// // API: Verify model with A2D (file upload)
// app.post(
//   "/api/a2d/verify",
//   upload.single("model"),
//   async (req: Request, res: Response) => {
//     let tempPath: string | null = null;

//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           error: "No model file provided",
//         });
//       }

//       tempPath = req.file.path;
//       const ownerId = req.body.ownerId || "anonymous";

//       console.log(`📤 Forwarding model to A2D API: ${req.file.originalname}`);

//       // Forward file to A2D API
//       const FormData = (await import("form-data")).default;
//       const formData = new FormData();
//       formData.append("model", fs.createReadStream(tempPath));
//       formData.append("ownerId", ownerId);

//       const fetch = (await import("node-fetch")).default;
//       const response = await fetch(`${A2D_API_URL}/api/verify`, {
//         method: "POST",
//         body: formData as any,
//         headers: formData.getHeaders(),
//       });

//       const result = await response.json();

//       console.log(
//         `${result.success ? "✅" : "❌"} A2D Result:`,
//         result.result?.pass ? "PASSED" : "FAILED"
//       );

//       res.json(result);
//     } catch (error: any) {
//       console.error("❌ A2D verification error:", error);
//       res.status(500).json({
//         success: false,
//         error: "A2D verification failed",
//         message: error.message,
//       });
//     } finally {
//       // Cleanup temp file
//       if (tempPath && fs.existsSync(tempPath)) {
//         try {
//           fs.unlinkSync(tempPath);
//         } catch (err) {
//           console.error("Failed to delete temp file:", err);
//         }
//       }
//     }
//   }
// );

// ////////////////////////////////////////////
// // A2D END
// ////////////////////////////////////////////

// // 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).render("error", {
//     title: "Page Not Found",
//     message: "The page you are looking for does not exist.",
//   });
// });

// // Error handler
// app.use((err: any, req: Request, res: Response, next: any) => {
//   console.error("Server error:", err);
//   res.status(500).render("error", {
//     title: "Server Error",
//     message: "An unexpected error occurred.",
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(
//     `🚀 AI Model Registry server running on http://localhost:${PORT}`
//   );
//   console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
//   console.log(
//     `🌙 Midnight Network: ${process.env.MIDNIGHT_NETWORK || "devnet"}`
//   );
// });

// export default app;
