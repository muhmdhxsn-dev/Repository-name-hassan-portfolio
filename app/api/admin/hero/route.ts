import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hero = await prisma.heroContent.findFirst();
    if (!hero) {
      return NextResponse.json({
        name: "Muhammad Hassan",
        title: "Available for backend & automation roles",
        subtitle: "I design and ship backend systems that don't fall over — Python services, REST & async APIs, and automation pipelines that remove the boring parts of other people's jobs. Currently pointing that same discipline at AI engineering.",
        typingText: ["Python Developer", "Backend Engineer", "API Developer", "Automation Enthusiast", "Future AI Engineer"],
        githubUsername: "octocat",
      });
    }
    return NextResponse.json({
      ...hero,
      typingText: JSON.parse(hero.typingText),
    });
  } catch (error) {
    console.error("GET Hero Error:", error);
    return NextResponse.json({ error: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const hero = await prisma.heroContent.findFirst();

    const heroData = {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      typingText: JSON.stringify(data.typingText || []),
      profileImage: data.profileImage,
      githubUsername: data.githubUsername || "octocat",
    };

    let updated;
    if (hero) {
      updated = await prisma.heroContent.update({
        where: { id: hero.id },
        data: heroData,
      });
    } else {
      updated = await prisma.heroContent.create({
        data: heroData,
      });
    }

    return NextResponse.json({
      success: true,
      hero: {
        ...updated,
        typingText: JSON.parse(updated.typingText),
      },
    });
  } catch (error) {
    console.error("PUT Hero Error:", error);
    return NextResponse.json({ error: "Failed to update hero content" }, { status: 500 });
  }
}
