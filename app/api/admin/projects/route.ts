import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list.map((p) => ({
      ...p,
      tech: JSON.parse(p.tech),
      features: JSON.parse(p.features),
    })));
  } catch (error) {
    console.error("GET Projects Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const count = await prisma.project.count();

    const created = await prisma.project.create({
      data: {
        title: data.title,
        desc: data.desc,
        tech: JSON.stringify(data.tech || []),
        features: JSON.stringify(data.features || []),
        challenge: data.challenge || "",
        github: data.github || "#",
        demo: data.demo || "#",
        gradient: data.gradient || "linear-gradient(135deg, rgba(99,102,241,.35), rgba(139,92,246,.15))",
        isFeatured: !!data.isFeatured,
        isPublished: data.isPublished !== false,
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, project: created });
  } catch (error) {
    console.error("POST Projects Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.project.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, project: updated });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: updateData.title,
        desc: updateData.desc,
        tech: updateData.tech ? JSON.stringify(updateData.tech) : undefined,
        features: updateData.features ? JSON.stringify(updateData.features) : undefined,
        challenge: updateData.challenge,
        github: updateData.github,
        demo: updateData.demo,
        gradient: updateData.gradient,
        isFeatured: updateData.isFeatured !== undefined ? !!updateData.isFeatured : undefined,
        isPublished: updateData.isPublished !== undefined ? !!updateData.isPublished : undefined,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("PUT Projects Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    const project = await prisma.project.delete({
      where: { id },
    });

    const remaining = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.project.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("DELETE Projects Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
