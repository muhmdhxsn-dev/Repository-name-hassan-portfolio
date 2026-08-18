import { prisma } from "./prisma";
import * as staticData from "./data";

export async function getPortfolioData() {
  // 1. Fetch Hero Content
  let hero = {
    name: "Muhammad Hassan",
    title: "Available for backend & automation roles",
    subtitle: "I design and ship backend systems that don't fall over — Python services, REST & async APIs, and automation pipelines that remove the boring parts of other people's jobs. Currently pointing that same discipline at AI engineering.",
    typingText: staticData.roles,
    profileImage: null as string | null,
    githubUsername: staticData.GITHUB_USERNAME,
    resumeUrl: "/resume.pdf",
  };

  try {
    const dbHero = await prisma.heroContent.findFirst();
    if (dbHero) {
      hero = {
        name: dbHero.name,
        title: dbHero.title,
        subtitle: dbHero.subtitle,
        typingText: JSON.parse(dbHero.typingText) as string[],
        profileImage: dbHero.profileImage,
        githubUsername: dbHero.githubUsername,
        resumeUrl: "/resume.pdf", // will be verified with Resume model below
      };
    }
    let dbResume = await prisma.resume.findUnique({
      where: { id: "resume-singleton" },
    });
    if (!dbResume) {
      dbResume = await prisma.resume.findFirst();
    }
    if (dbResume) {
      if (dbResume.fileUrl.startsWith("data:")) {
        hero.resumeUrl = "/api/resume";
      } else {
        hero.resumeUrl = dbResume.fileUrl;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch Hero content, using static fallback:", e);
  }

  // 2. Fetch Stats
  let stats = staticData.stats;
  // Dynamic stats calculation helper
  try {
    const projectCount = await prisma.project.count({ where: { isPublished: true } });
    if (projectCount > 0) {
      stats = [
        { value: projectCount, suffix: "+", label: "Projects shipped" },
        { value: 3, suffix: "+", label: "Years in Python" },
        { value: 99, suffix: "%", label: "Uptime shipped" },
      ];
    }
  } catch (e) {
    // ignore, fallback to static stats
  }

  // 3. Fetch About Cards
  let aboutCards = staticData.aboutCards;
  try {
    const dbAbout = await prisma.aboutCard.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (dbAbout.length > 0) {
      aboutCards = dbAbout.map((c) => ({
        title: c.title,
        body: c.body,
        wide: c.wide,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch About Cards, using static fallback");
  }

  // 4. Fetch Skills
  let skills = staticData.skills;
  try {
    const dbSkills = await prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (dbSkills.length > 0) {
      skills = dbSkills.map((s) => ({
        cat: s.category,
        items: JSON.parse(s.items) as string[],
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch Skills, using static fallback");
  }

  // 5. Fetch Projects
  let projects = staticData.projects;
  try {
    const dbProjects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    });
    if (dbProjects.length > 0) {
      projects = dbProjects.map((p) => ({
        title: p.title,
        desc: p.desc,
        tech: JSON.parse(p.tech) as string[],
        features: JSON.parse(p.features) as string[],
        challenge: p.challenge,
        github: p.github,
        demo: p.demo,
        gradient: p.gradient,
        isFeatured: p.isFeatured,
      } as any));
    }
  } catch (e) {
    console.warn("Failed to fetch Projects, using static fallback");
  }

  // 6. Fetch Journey Items
  let journey = staticData.journey;
  try {
    const dbJourney = await prisma.journeyItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (dbJourney.length > 0) {
      journey = dbJourney.map((j) => ({
        title: j.title,
        desc: j.desc,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch Journey items, using static fallback");
  }

  // 7. Fetch Social Links
  let socialLinks = [
    { platform: "email", url: "mailto:hello@muhammadhassan.dev", iconName: "FiMail" },
    { platform: "github", url: "https://github.com/", iconName: "FiGithub" },
    { platform: "linkedin", url: "https://linkedin.com/", iconName: "FiLinkedin" },
  ];
  try {
    const dbSocials = await prisma.socialLink.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (dbSocials.length > 0) {
      socialLinks = dbSocials.map((s) => ({
        platform: s.platform,
        url: s.url,
        iconName: s.iconName,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch Social Links, using static fallback");
  }

  // 8. Generate Terminal Commands dynamically
  let terminalCommands = staticData.terminalCommands;
  try {
    const skillsListStr = skills.map((s) => s.items.join(" · ")).join(" · ");
    const projectsListStr = projects
      .map((p, idx) => `${idx + 1}. ${p.title} — ${p.desc}`)
      .join("\n");
    const emailLink = socialLinks.find((s) => s.platform === "email")?.url || "mailto:hello@muhammadhassan.dev";
    const githubLink = socialLinks.find((s) => s.platform === "github")?.url || "https://github.com/muhammadhassan";
    const linkedinLink = socialLinks.find((s) => s.platform === "linkedin")?.url || "https://linkedin.com/in/muhammadhassan";

    terminalCommands = {
      help: `Available commands:
  help      — list commands
  about     — who is ${hero.name}
  skills    — technical skill set
  projects  — selected work
  resume    — get resume link
  github    — github profile
  contact   — how to reach me
  clear     — clear the terminal`,
      about: hero.subtitle,
      skills: skillsListStr,
      projects: `${projectsListStr}\ntype 'contact' to ask for repo links.`,
      resume: `Resume: ${hero.resumeUrl} (downloadable directly)`,
      github: githubLink,
      contact: `Email: ${emailLink.replace("mailto:", "")} · LinkedIn: ${linkedinLink.replace("https://", "")}`,
    };
  } catch (e) {
    // fallback
  }

  // 9. Generate AI Assistant Answers dynamically
  let aiAnswers = staticData.aiAnswers;
  try {
    const skillsShort = skills.flatMap((s) => s.items).slice(0, 10).join(", ");
    const projectsShort = projects.map((p) => p.title).join(", ");
    const emailAddr = (socialLinks.find((s) => s.platform === "email")?.url || "hello@muhammadhassan.dev").replace("mailto:", "");

    aiAnswers = {
      who: {
        label: "Who are you?",
        answer: `I'm ${hero.name} — a Python developer focused on backend development, automation, and APIs, currently growing into AI engineering.`,
      },
      tech: {
        label: "What technologies do you use?",
        answer: `I specialize in: ${skillsShort}. And I'm always adding more to my stack.`,
      },
      projects: {
        label: "Show your projects.",
        answer: `Some of my featured projects are: ${projectsShort}. Scroll down to see full descriptions and challenges solved!`,
      },
      learning: {
        label: "What are you learning?",
        answer: `System design, cloud-native deployment, and the fundamentals of AI engineering: LLM APIs, RAG pipelines, and vector databases.`,
      },
      hire: {
        label: "Why hire you?",
        answer: `I ship backend systems that are reliable, well-documented, and easy to hand off — and I actively automate away repetitive work instead of just doing it manually.`,
      },
      contact: {
        label: "How can I contact you?",
        answer: `Best way is email: ${emailAddr} — or use the contact form at the bottom of this page.`,
      },
    };
  } catch (e) {
    // fallback
  }

  return {
    hero,
    stats,
    aboutCards,
    skills,
    projects,
    journey,
    socialLinks,
    terminalCommands,
    aiAnswers,
  };
}
