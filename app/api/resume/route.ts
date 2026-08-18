import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbResume = await prisma.resume.findFirst({
      where: { id: "resume-singleton" },
    });

    if (dbResume && dbResume.fileUrl.startsWith("data:application/pdf;base64,")) {
      const base64Content = dbResume.fileUrl.substring("data:application/pdf;base64,".length);
      const buffer = Buffer.from(base64Content, "base64");

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=resume.pdf",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    // Fallback to static public/resume.pdf if database record does not contain the data URL
    const publicDir = join(process.cwd(), "public");
    const filepath = join(publicDir, "resume.pdf");
    try {
      const fileBuffer = await readFile(filepath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=resume.pdf",
        },
      });
    } catch {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error serving resume:", error);
    return NextResponse.json({ error: "Failed to serve resume" }, { status: 500 });
  }
}
