#!/usr/bin/env tsx

import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Load environment variables
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Validate environment variables
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("❌ Missing Cloudinary credentials in environment variables!");
  console.error("\nRequired environment variables:");
  console.error("  - CLOUDINARY_CLOUD_NAME");
  console.error("  - CLOUDINARY_API_KEY");
  console.error("  - CLOUDINARY_API_SECRET");
  console.error("\nAdd them to your .env file or export them in your shell.");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

interface UploadOptions {
  filePath: string;
  folder: string;
  publicId?: string;
  overwrite?: boolean;
}

async function uploadImage(options: UploadOptions): Promise<any> {
  const { filePath, folder, publicId, overwrite = false } = options;

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Upload options
  const uploadOptions: any = {
    folder,
    use_filename: !publicId,
    unique_filename: !publicId,
    overwrite,
    resource_type: "auto",
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  console.log(`\n📤 Uploading ${path.basename(filePath)} to Cloudinary...`);

  try {
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result;
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

async function main() {
  console.log("📸 Cloudinary Image Uploader\n");

  // Get file path
  const filePath = await question("Enter the path to the image file: ");
  if (!filePath) {
    console.error("❌ File path is required");
    rl.close();
    return;
  }

  // Resolve to absolute path
  const absolutePath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    rl.close();
    return;
  }

  // Get file info
  const fileName = path.basename(absolutePath);
  const fileExt = path.extname(fileName);
  const fileNameWithoutExt = path.basename(fileName, fileExt);

  console.log(`\n📁 File: ${fileName}`);
  console.log(`   Path: ${absolutePath}`);

  // Get folder (default: blog)
  const folderInput = await question("\nCloudinary folder (blog): ");
  const folder = folderInput || "blog";

  // Get public ID (optional)
  const suggestedPublicId = fileNameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, "-");
  const publicIdInput = await question(
    `Public ID (${suggestedPublicId}${fileExt}): `
  );
  const publicId = publicIdInput
    ? publicIdInput.replace(fileExt, "")
    : suggestedPublicId;

  // Ask about overwrite
  const overwriteInput = await question(
    "\nOverwrite if exists? (y/n) [n]: "
  );
  const overwrite = overwriteInput.toLowerCase() === "y";

  // Confirm
  console.log("\n📋 Upload Summary:");
  console.log(`File: ${fileName}`);
  console.log(`Folder: ${folder}`);
  console.log(`Public ID: ${publicId}`);
  console.log(`Full path: ${folder}/${publicId}${fileExt}`);
  console.log(`Overwrite: ${overwrite ? "Yes" : "No"}\n`);

  const confirm = await question("Upload this image? (y/n): ");
  if (confirm.toLowerCase() !== "y") {
    console.log("❌ Cancelled");
    rl.close();
    return;
  }

  try {
    const result = await uploadImage({
      filePath: absolutePath,
      folder,
      publicId,
      overwrite,
    });

    console.log("\n✅ Upload successful!\n");
    console.log("📊 Upload Details:");
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Format: ${result.format}`);
    console.log(`   Size: ${(result.bytes / 1024).toFixed(2)} KB`);
    console.log(`   Width: ${result.width}px`);
    console.log(`   Height: ${result.height}px`);

    console.log("\n📝 Use in blog post:");
    console.log(`   Cloudinary public ID: ${result.public_id}`);
    console.log(`   Full URL: ${result.secure_url}`);

    console.log(
      "\n💡 When creating a blog post with npm run blog:new, use:"
    );
    console.log(`   ${result.public_id}`);
  } catch (error: any) {
    console.error("\n❌ Upload failed:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Allow command-line usage
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === "--help") {
  console.log(`
📸 Cloudinary Image Uploader

Usage:
  npm run blog:upload              # Interactive mode
  tsx scripts/upload-to-cloudinary.ts  # Direct execution

Environment Variables Required:
  CLOUDINARY_CLOUD_NAME    Your Cloudinary cloud name
  CLOUDINARY_API_KEY       Your Cloudinary API key
  CLOUDINARY_API_SECRET    Your Cloudinary API secret

Example:
  $ npm run blog:upload
  Enter the path to the image file: ./public/my-image.png
  Cloudinary folder (blog): blog
  Public ID (my-image.png): my-custom-name
  `);
  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
