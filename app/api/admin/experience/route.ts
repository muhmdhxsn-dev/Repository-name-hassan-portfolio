import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.experience.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Experience Error:", error);
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const count = await prisma.experience.count();

    const created = await prisma.experience.create({
      data: {
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate || null,
        description: data.description || "",
        isCurrent: !!data.isCurrent,
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, experience: created });
  } catch (error) {
    console.error("POST Experience Error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing experience ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.experience.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, experience: updated });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company: updateData.company,
        role: updateData.role,
        startDate: updateData.startDate,
        endDate: updateData.endDate,
        description: updateData.description,
        isCurrent: updateData.isCurrent !== undefined ? !!updateData.isCurrent : undefined,
      },
    });

    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    console.error("PUT Experience Error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing experience ID" }, { status: 400 });
    }

    const deleted = await prisma.experience.delete({
      where: { id },
    });

    const remaining = await prisma.experience.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.experience.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, experience: deleted });
  } catch (error) {
    console.error("DELETE Experience Error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
