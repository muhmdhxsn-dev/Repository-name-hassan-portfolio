export const roles = [
  "Python Developer",
  "Backend Engineer",
  "API Developer",
  "Automation Enthusiast",
  "Future AI Engineer",
];

export const stats = [
  { value: 20, suffix: "+", label: "Projects shipped" },
  { value: 3, suffix: "+", label: "Years in Python" },
  { value: 99, suffix: "%", label: "Uptime shipped" },
];

export const aboutCards = [
  {
    title: "Introduction",
    body: "I'm a Python developer who cares about the unglamorous parts of software — reliability, clear contracts between services, and automation that quietly saves people hours every week. I build backend systems and APIs that other engineers enjoy integrating with.",
  },
  {
    title: "Career Goal",
    body: "Grow from backend engineering into AI engineering — applying the same rigor I use for APIs and data pipelines to building and shipping production ML/LLM-powered systems, not just notebooks.",
  },
  {
    title: "Current Learning Roadmap",
    body: "Deepening system design and cloud-native deployment, then layering in ML fundamentals, vector databases, and LLM application patterns (RAG, agents, tool use).",
  },
  {
    title: "Strengths",
    body: "Clean API design, debugging under pressure, turning repetitive manual work into scripts and pipelines, and writing code the next person can actually read.",
  },
  {
    title: "Fun Facts",
    body: "I automate things nobody asked me to automate. My terminal history is basically a diary. And yes — this portfolio has an actual working terminal, scroll down and try it.",
    wide: true,
  },
];

export const skills = [
  { cat: "Programming", items: ["Python", "JavaScript", "SQL", "Bash"] },
  { cat: "Backend", items: ["FastAPI", "Django", "Flask", "REST & Async APIs"] },
  { cat: "Databases", items: ["PostgreSQL", "MySQL", "Redis", "MongoDB"] },
  { cat: "Cloud", items: ["AWS (EC2, S3, Lambda)", "Vercel", "Render", "Cloudflare"] },
  { cat: "DevOps", items: ["Docker", "GitHub Actions", "CI/CD", "Nginx"] },
  { cat: "AI", items: ["OpenAI / Anthropic APIs", "LangChain basics", "Prompt Engineering", "Vector DBs (learning)"] },
  { cat: "Automation", items: ["Selenium", "Cron & Task Queues", "Web Scraping", "Celery"] },
  { cat: "Tools", items: ["Git", "Postman", "Linux", "VS Code"] },
];

export type Project = {
  title: string;
  desc: string;
  tech: string[];
  features: string[];
  challenge: string;
  github: string;
  demo: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    title: "TaskFlow API",
    desc: "A multi-tenant task management REST API with JWT auth, rate limiting, and background job processing.",
    tech: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
    features: [
      "Role-based access control",
      "Async background jobs via Celery",
      "Auto-generated OpenAPI docs",
    ],
    challenge:
      "Solved N+1 query issues by redesigning the ORM layer, cutting p95 latency by 60%.",
    github: "#",
    demo: "#",
    gradient: "linear-gradient(135deg, rgba(99,102,241,.35), rgba(139,92,246,.15))",
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
    challenge:
      "Built resilience against layout changes by decoupling scraping logic from parsing rules.",
    github: "#",
    demo: "#",
    gradient: "linear-gradient(135deg, rgba(59,130,246,.35), rgba(99,102,241,.15))",
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
    challenge:
      "Reduced manual invoice processing time from 2 hours/day to under 5 minutes.",
    github: "#",
    demo: "#",
    gradient: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(59,130,246,.15))",
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
    challenge:
      "Tuned chunk size and retrieval-k to balance answer accuracy against latency.",
    github: "#",
    demo: "#",
    gradient: "linear-gradient(135deg, rgba(99,102,241,.35), rgba(59,130,246,.2))",
  },
];

export const journey = [
  { title: "Python Fundamentals", desc: "Core language, data structures, OOP, scripting." },
  { title: "Backend Development", desc: "Django & FastAPI, REST API design, authentication." },
  { title: "Databases & Data Modeling", desc: "PostgreSQL, MySQL, Redis, query optimization." },
  { title: "Automation & Tooling", desc: "Web scraping, task queues, scheduled pipelines." },
  { title: "Cloud & DevOps", desc: "Docker, CI/CD, AWS deployment, monitoring." },
  { title: "AI Engineering (current)", desc: "LLM APIs, RAG systems, vector databases, agentic tools." },
];

export const terminalCommands: Record<string, string> = {
  help: `Available commands:
  help      — list commands
  about     — who is Muhammad Hassan
  skills    — technical skill set
  projects  — selected work
  resume    — get resume link
  github    — github profile
  contact   — how to reach me
  clear     — clear the terminal`,
  about:
    "Python developer focused on backend systems, APIs, and automation. Currently leveling up toward AI engineering.",
  skills:
    "Python · FastAPI · Django · PostgreSQL · Redis · Docker · AWS · Celery · Selenium · OpenAI API",
  projects: `1. TaskFlow API — multi-tenant task management API
2. Scrape & Report Pipeline — nightly automation pipeline
3. InvoiceOps — invoice automation for internal ops
4. DocQuery — retrieval-augmented Q&A service
type 'contact' to ask for repo links.`,
  resume: "Resume: /resume.pdf (add your file to /public and update this link)",
  github: "https://github.com/muhammadhassan",
  contact: "Email: hello@muhammadhassan.dev · LinkedIn: linkedin.com/in/muhammadhassan",
};

export const aiAnswers: Record<string, { label: string; answer: string }> = {
  who: {
    label: "Who are you?",
    answer:
      "I'm Muhammad Hassan — a Python developer focused on backend development, automation, and APIs, currently growing into AI engineering.",
  },
  tech: {
    label: "What technologies do you use?",
    answer:
      "Python, FastAPI, Django, PostgreSQL, Redis, Docker, AWS, Celery, Selenium — plus OpenAI/Anthropic APIs for AI-focused projects.",
  },
  projects: {
    label: "Show your projects.",
    answer:
      "Check the Projects section — highlights include TaskFlow API, a Scrape & Report automation pipeline, InvoiceOps, and DocQuery (a RAG assistant).",
  },
  learning: {
    label: "What are you learning?",
    answer:
      "System design, cloud-native deployment, and the fundamentals of AI engineering: LLM APIs, RAG pipelines, and vector databases.",
  },
  hire: {
    label: "Why hire you?",
    answer:
      "I ship backend systems that are reliable, well-documented, and easy to hand off — and I actively automate away repetitive work instead of just doing it manually.",
  },
  contact: {
    label: "How can I contact you?",
    answer:
      "Best way is email: hello@muhammadhassan.dev — or use the contact form at the bottom of this page.",
  },
};

// Change this to your real GitHub username to power the live dashboard.
export const GITHUB_USERNAME = "octocat";
