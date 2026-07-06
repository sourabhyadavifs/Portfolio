import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser with a high limit for base64 images
  app.use(express.json({ limit: "10mb" }));

  // API to upload profile photo
  app.post("/api/upload-profile", (req: express.Request, res: express.Response) => {
    try {
      const isOwnerHeader = req.headers["x-portfolio-owner"] === "true";
      if (!isOwnerHeader && process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Access denied: Unauthorized upload attempt." });
      }

      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Check if it's base64 and clean up metadata prefix if present
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(image, "base64");
      }

      const assetsDir = path.join(process.cwd(), "assets");
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      const filePath = path.join(assetsDir, "profile.jpg");
      fs.writeFileSync(filePath, buffer);

      console.log("Successfully saved uploaded profile image to", filePath);
      return res.json({ success: true, url: "/assets/profile.jpg" });
    } catch (err: any) {
      console.error("Error saving profile image:", err);
      return res.status(500).json({ error: err.message || "Failed to save profile image" });
    }
  });

  // Serve profile image directly
  app.get("/assets/profile.jpg", (req: express.Request, res: express.Response) => {
    const filePath = path.join(process.cwd(), "assets", "profile.jpg");
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath);
        if (content.length > 4 && content[0] === 0x89 && content[1] === 0x50 && content[2] === 0x4e && content[3] === 0x47) {
          res.setHeader("Content-Type", "image/png");
        } else {
          res.setHeader("Content-Type", "image/jpeg");
        }
      } catch (e) {
        res.setHeader("Content-Type", "image/jpeg");
      }
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.sendFile(filePath);
    } else {
      res.redirect("https://www.yadavsaurabh.com/assets/images/SaurabhYadav.png");
    }
  });

  // Serve other static assets from the root assets directory
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Custom means we handle index.html routing manually
    });
    // Mount Vite's middleware
    app.use(vite.middlewares);
  } else {
    // Serve static assets (except index.html)
    app.use(express.static(path.join(process.cwd(), "dist"), { index: false }));
  }

  // Intercept index.html and inject dynamic social media metadata tags
  app.get("*", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const url = req.originalUrl;

    // Skip requests with file extensions, assets, or API routes
    if (url.startsWith("/api") || url.startsWith("/assets") || url.includes(".")) {
      return next();
    }

    try {
      let template: string;
      if (process.env.NODE_ENV !== "production") {
        const templatePath = path.join(process.cwd(), "index.html");
        template = fs.readFileSync(templatePath, "utf-8");
        // Apply Vite's HTML transforms (e.g. inject client script)
        template = await vite.transformIndexHtml(url, template);
      } else {
        const templatePath = path.join(process.cwd(), "dist", "index.html");
        template = fs.readFileSync(templatePath, "utf-8");
      }

      // Check if custom profile exists
      const hasCustomProfile = fs.existsSync(path.join(process.cwd(), "assets", "profile.jpg"));

      // Determine absolute dynamic host URL for metadata
      const host = req.get("host") || "localhost:3000";
      const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
      const protocol = isHttps ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;

      // Build image URL with dynamic cache-buster timestamp
      const imageUrl = hasCustomProfile
        ? `${baseUrl}/assets/profile.jpg?v=${Date.now()}`
        : `https://www.yadavsaurabh.com/assets/images/SaurabhYadav.png`;

      const title = "Sourabh Yadav";
      const description = "Building products where user behavior, data, and AI intersect.";
      const pageUrl = `${baseUrl}${url}`;

      // Create Open Graph and Twitter metadata tags
      const metaTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${pageUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${imageUrl}" />

    <!-- Standard SEO Fallbacks -->
    <meta name="description" content="${description}" />
    <title>${title}</title>
      `;

      let html = template;
      // Inject tags inside <head>
      if (html.includes("</head>")) {
        html = html.replace("</head>", `${metaTags}\n  </head>`);
      } else {
        html = html + metaTags;
      }

      return res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (process.env.NODE_ENV !== "production" && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error("Error serving index.html:", e);
      return res.status(500).end(e.stack || "Internal Server Error");
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
