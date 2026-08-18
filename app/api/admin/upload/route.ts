import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAdminApi } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit file size to 5MB (5 * 1024 * 1024 bytes)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds the maximum size limit of 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicDir = join(process.cwd(), "public");

    if (type === "resume") {
      // Validate PDF format
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "Only PDF files are allowed for resume" }, { status: 400 });
      }

      const base64Data = buffer.toString("base64");
      const base64Url = `data:application/pdf;base64,${base64Data}`;

      const { prisma } = await import("@/lib/prisma");
      await prisma.resume.upsert({
        where: { id: "resume-singleton" },
        create: { id: "resume-singleton", fileUrl: base64Url },
        update: { fileUrl: base64Url, updatedAt: new Date() },
      });

      return NextResponse.json({ success: true, url: "/api/resume" });
    } else {
      const uploadsDir = join(publicDir, "uploads");
      try {
        await mkdir(uploadsDir, { recursive: true });
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${Date.now()}_${originalName}`;
        const filepath = join(uploadsDir, filename);

        await writeFile(filepath, buffer);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
      } catch (err: any) {
        console.error("Local write failed:", err);
        if (err.code === "EROFS" || err.message.includes("read-only")) {
          return NextResponse.json({ error: "Write operation failed: File system is read-only on cloud environment" }, { status: 403 });
        }
        return NextResponse.json({ error: "Failed to write file to local storage" }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred during upload" }, { status: 500 });
  }
}
