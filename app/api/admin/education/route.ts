import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.education.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Education Error:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const count = await prisma.education.count();

    const created = await prisma.education.create({
      data: {
        institution: data.institution,
        degree: data.degree,
        startDate: data.startDate,
        endDate: data.endDate || null,
        description: data.description || "",
        isCurrent: !!data.isCurrent,
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, education: created });
  } catch (error) {
    console.error("POST Education Error:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing education ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.education.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, education: updated });
    }

    const updated = await prisma.education.update({
      where: { id },
      data: {
        institution: updateData.institution,
        degree: updateData.degree,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
        description: updateData.description,
        isCurrent: updateData.isCurrent !== undefined ? !!updateData.isCurrent : undefined,
      },
    });

    return NextResponse.json({ success: true, education: updated });
  } catch (error) {
    console.error("PUT Education Error:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing education ID" }, { status: 400 });
    }

    const deleted = await prisma.education.delete({
      where: { id },
    });

    const remaining = await prisma.education.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.education.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, education: deleted });
  } catch (error) {
    console.error("DELETE Education Error:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
