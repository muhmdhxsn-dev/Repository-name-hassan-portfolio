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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = join(process.cwd(), "public");

    if (type === "resume") {
      const filepath = join(publicDir, "resume.pdf");
      await writeFile(filepath, buffer);
      
      const { prisma } = await import("@/lib/prisma");
      await prisma.resume.upsert({
        where: { id: "resume-singleton" },
        create: { id: "resume-singleton", fileUrl: "/resume.pdf" },
        update: { fileUrl: "/resume.pdf", updatedAt: new Date() },
      });

      return NextResponse.json({ success: true, url: "/resume.pdf" });
    } else {
      const uploadsDir = join(publicDir, "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${Date.now()}_${originalName}`;
      const filepath = join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
