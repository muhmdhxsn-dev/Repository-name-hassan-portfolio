import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const list = await prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list.map((s) => ({
      ...s,
      items: JSON.parse(s.items),
    })));
  } catch (error) {
    console.error("GET Skills Error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const count = await prisma.skill.count();

    const created = await prisma.skill.create({
      data: {
        category: data.category,
        items: JSON.stringify(data.items || []),
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, skill: created });
  } catch (error) {
    console.error("POST Skills Error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing skill ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.skill.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, skill: updated });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        category: updateData.category,
        items: updateData.items ? JSON.stringify(updateData.items) : undefined,
      },
    });

    return NextResponse.json({ success: true, skill: updated });
  } catch (error) {
    console.error("PUT Skills Error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing skill ID" }, { status: 400 });
    }

    const deleted = await prisma.skill.delete({
      where: { id },
    });

    const remaining = await prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.skill.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, skill: deleted });
  } catch (error) {
    console.error("DELETE Skills Error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
