import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, isRead } = data;

    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !!isRead },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("PATCH Messages Error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 });
    }

    const deleted = await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: deleted });
  } catch (error) {
    console.error("DELETE Messages Error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
