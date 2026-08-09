import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.certificate.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Certificates Error:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const count = await prisma.certificate.count();

    const created = await prisma.certificate.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        date: data.date,
        fileUrl: data.fileUrl || null,
        credentialUrl: data.credentialUrl || null,
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, certificate: created });
  } catch (error) {
    console.error("POST Certificates Error:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing certificate ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.certificate.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, certificate: updated });
    }

    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        name: updateData.name,
        issuer: updateData.issuer,
        date: updateData.date,
        fileUrl: updateData.fileUrl,
        credentialUrl: updateData.credentialUrl,
      },
    });

    return NextResponse.json({ success: true, certificate: updated });
  } catch (error) {
    console.error("PUT Certificates Error:", error);
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing certificate ID" }, { status: 400 });
    }

    const deleted = await prisma.certificate.delete({
      where: { id },
    });

    const remaining = await prisma.certificate.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.certificate.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, certificate: deleted });
  } catch (error) {
    console.error("DELETE Certificates Error:", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
