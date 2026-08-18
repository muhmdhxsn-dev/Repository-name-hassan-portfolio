import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin User
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be provided.");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  console.log(`Admin user seeded: ${admin.username}`);

  // 2. Hero Content
  const heroCount = await prisma.heroContent.count();
  if (heroCount === 0) {
    await prisma.heroContent.create({
      data: {
        name: "Muhammad Hassan",
        title: "Available for backend & automation roles",
        subtitle: "I design and ship backend systems that don't fall over — Python services, REST & async APIs, and automation pipelines that remove the boring parts of other people's jobs. Currently pointing that same discipline at AI engineering.",
        typingText: JSON.stringify([
          "Python Developer",
          "Backend Engineer",
          "API Developer",
          "Automation Enthusiast",
          "Future AI Engineer",
        ]),
        githubUsername: "octocat",
      },
    });
    console.log("Hero content seeded.");
  }

  // 3. About Cards
  const aboutCount = await prisma.aboutCard.count();
  if (aboutCount === 0) {
    const cards = [
      {
        title: "Introduction",
        body: "I'm a Python developer who cares about the unglamorous parts of software — reliability, clear contracts between services, and automation that quietly saves people hours every week. I build backend systems and APIs that other engineers enjoy integrating with.",
        wide: false,
      },
      {
        title: "Career Goal",
        body: "Grow from backend engineering into AI engineering — applying the same rigor I use for APIs and data pipelines to building and shipping production ML/LLM-powered systems, not just notebooks.",
        wide: false,
      },
      {
        title: "Current Learning Roadmap",
        body: "Deepening system design and cloud-native deployment, then layering in ML fundamentals, vector databases, and LLM application patterns (RAG, agents, tool use).",
        wide: false,
      },
      {
        title: "Strengths",
        body: "Clean API design, debugging under pressure, turning repetitive manual work into scripts and pipelines, and writing code the next person can actually read.",
        wide: false,
      },
      {
        title: "Fun Facts",
        body: "I automate things nobody asked me to automate. My terminal history is basically a diary. And yes — this portfolio has an actual working terminal, scroll down and try it.",
        wide: true,
      },
    ];

    for (let i = 0; i < cards.length; i++) {
      await prisma.aboutCard.create({
        data: {
          ...cards[i],
          displayOrder: i,
        },
      });
    }
    console.log("About cards seeded.");
  }

  // 4. Skills
  const skillsCount = await prisma.skill.count();
  if (skillsCount === 0) {
    const skills = [
      { cat: "Programming", items: ["Python", "JavaScript", "SQL", "Bash"] },
      { cat: "Backend", items: ["FastAPI", "Django", "Flask", "REST & Async APIs"] },
      { cat: "Databases", items: ["PostgreSQL", "MySQL", "Redis", "MongoDB"] },
      { cat: "Cloud", items: ["AWS (EC2, S3, Lambda)", "Vercel", "Render", "Cloudflare"] },
      { cat: "DevOps", items: ["Docker", "GitHub Actions", "CI/CD", "Nginx"] },
      { cat: "AI", items: ["OpenAI / Anthropic APIs", "LangChain basics", "Prompt Engineering", "Vector DBs (learning)"] },
      { cat: "Automation", items: ["Selenium", "Cron & Task Queues", "Web Scraping", "Celery"] },
      { cat: "Tools", items: ["Git", "Postman", "Linux", "VS Code"] },
    ];

    for (let i = 0; i < skills.length; i++) {
      await prisma.skill.create({
        data: {
          category: skills[i].cat,
          items: JSON.stringify(skills[i].items),
          displayOrder: i,
        },
      });
    }
    console.log("Skills seeded.");
  }

  // 5. Projects
  const projectsCount = await prisma.project.count();
  if (projectsCount === 0) {
    const projects = [
      {
        title: "TaskFlow API",
        desc: "A multi-tenant task management REST API with JWT auth, rate limiting, and background job processing.",
        tech: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
        features: [
          "Role-based access control",
          "Async background jobs via Celery",
          "Auto-generated OpenAPI docs",
        ],
        challenge: "Solved N+1 query issues by redesigning the ORM layer, cutting p95 latency by 60%.",
        github: "#",
        demo: "#",
        gradient: "linear-gradient(135deg, rgba(99,102,241,.35), rgba(139,92,246,.15))",
        isFeatured: true,
      },
      {
        title: "Scrape & Report Pipeline",
        desc: "Automation pipeline that scrapes pricing data nightly, cleans it, and emails a formatted report — zero human touch.",
        tech: ["Python", "Selenium", "Pandas", "Cron"],
        features: [
          "Self-healing selectors",
          "Automatic retry with backoff",
          "Slack + email delivery",
        ],
        challenge: "Built resilience against layout changes by decoupling scraping logic from parsing rules.",
        github: "#",
        demo: "#",
        gradient: "linear-gradient(135deg, rgba(59,130,246,.35), rgba(99,102,241,.15))",
        isFeatured: false,
      },
      {
        title: "InvoiceOps",
        desc: "Internal tool that auto-generates, validates, and archives invoices from structured order data.",
        tech: ["Django", "PostgreSQL", "AWS S3", "Docker"],
        features: [
          "PDF generation pipeline",
          "Audit-safe versioning",
          "REST API for external ERP integration",
        ],
        challenge: "Reduced manual invoice processing time from 2 hours/day to under 5 minutes.",
        github: "#",
        demo: "#",
        gradient: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(59,130,246,.15))",
        isFeatured: false,
      },
      {
        title: "DocQuery — RAG Assistant",
        desc: "An early AI-engineering project: a retrieval-augmented Q&A service over private document sets.",
        tech: ["Python", "FastAPI", "Vector DB", "OpenAI API"],
        features: [
          "Chunking + embedding pipeline",
          "Source-cited answers",
          "Simple web chat UI",
        ],
        challenge: "Tuned chunk size and retrieval-k to balance answer accuracy against latency.",
        github: "#",
        demo: "#",
        gradient: "linear-gradient(135deg, rgba(99,102,241,.35), rgba(59,130,246,.2))",
        isFeatured: false,
      },
    ];

    for (let i = 0; i < projects.length; i++) {
      await prisma.project.create({
        data: {
          title: projects[i].title,
          desc: projects[i].desc,
          tech: JSON.stringify(projects[i].tech),
          features: JSON.stringify(projects[i].features),
          challenge: projects[i].challenge,
          github: projects[i].github,
          demo: projects[i].demo,
          gradient: projects[i].gradient,
          isFeatured: projects[i].isFeatured,
          displayOrder: i,
        },
      });
    }
    console.log("Projects seeded.");
  }

  // 6. Journey Items (Milestones)
  const journeyCount = await prisma.journeyItem.count();
  if (journeyCount === 0) {
    const journey = [
      { title: "Python Fundamentals", desc: "Core language, data structures, OOP, scripting." },
      { title: "Backend Development", desc: "Django & FastAPI, REST API design, authentication." },
      { title: "Databases & Data Modeling", desc: "PostgreSQL, MySQL, Redis, query optimization." },
      { title: "Automation & Tooling", desc: "Web scraping, task queues, scheduled pipelines." },
      { title: "Cloud & DevOps", desc: "Docker, CI/CD, AWS deployment, monitoring." },
      { title: "AI Engineering (current)", desc: "LLM APIs, RAG systems, vector databases, agentic tools." },
    ];

    for (let i = 0; i < journey.length; i++) {
      await prisma.journeyItem.create({
        data: {
          title: journey[i].title,
          desc: journey[i].desc,
          displayOrder: i,
        },
      });
    }
    console.log("Journey seeded.");
  }

  // 7. Social Links
  const socialsCount = await prisma.socialLink.count();
  if (socialsCount === 0) {
    const socials = [
      { platform: "email", url: "mailto:hello@muhammadhassan.dev", iconName: "FiMail" },
      { platform: "github", url: "https://github.com/muhammadhassan", iconName: "FiGithub" },
      { platform: "linkedin", url: "https://linkedin.com/in/muhammadhassan", iconName: "FiLinkedin" },
      { platform: "twitter", url: "https://twitter.com/", iconName: "FiTwitter" },
    ];

    for (let i = 0; i < socials.length; i++) {
      await prisma.socialLink.create({
        data: {
          ...socials[i],
          displayOrder: i,
        },
      });
    }
    console.log("Social links seeded.");
  }

  // 8. Resume
  const resumeCount = await prisma.resume.count();
  if (resumeCount === 0) {
    await prisma.resume.create({
      data: {
        id: "resume-singleton",
        fileUrl: "/resume.pdf",
      },
    });
    console.log("Resume seeded.");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
