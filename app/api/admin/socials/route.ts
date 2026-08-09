import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const list = await prisma.socialLink.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Socials Error:", error);
    return NextResponse.json({ error: "Failed to fetch socials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const count = await prisma.socialLink.count();

    const created = await prisma.socialLink.upsert({
      where: { platform: data.platform },
      update: {
        url: data.url,
        iconName: data.iconName || "",
      },
      create: {
        platform: data.platform,
        url: data.url,
        iconName: data.iconName || "",
        displayOrder: count,
      },
    });

    return NextResponse.json({ success: true, social: created });
  } catch (error) {
    console.error("POST Socials Error:", error);
    return NextResponse.json({ error: "Failed to create/update social link" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing social ID" }, { status: 400 });
    }

    if (updateData.displayOrder !== undefined) {
      const updated = await prisma.socialLink.update({
        where: { id },
        data: { displayOrder: parseInt(updateData.displayOrder) },
      });
      return NextResponse.json({ success: true, social: updated });
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: {
        platform: updateData.platform,
        url: updateData.url,
        iconName: updateData.iconName,
      },
    });

    return NextResponse.json({ success: true, social: updated });
  } catch (error) {
    console.error("PUT Socials Error:", error);
    return NextResponse.json({ error: "Failed to update social link" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminApi(request);
  if (unauthorized) return unauthorized;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing social ID" }, { status: 400 });
    }

    const deleted = await prisma.socialLink.delete({
      where: { id },
    });

    const remaining = await prisma.socialLink.findMany({
      orderBy: { displayOrder: "asc" },
    });
    for (let i = 0; i < remaining.length; i++) {
      await prisma.socialLink.update({
        where: { id: remaining[i].id },
        data: { displayOrder: i },
      });
    }

    return NextResponse.json({ success: true, social: deleted });
  } catch (error) {
    console.error("DELETE Socials Error:", error);
    return NextResponse.json({ error: "Failed to delete social link" }, { status: 500 });
  }
}
