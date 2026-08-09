import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { getPortfolioData } from "@/lib/db-queries";

const siteUrl = "https://muhammadhassan.dev";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Hassan",
  jobTitle: "Python Backend Developer",
  description:
    "Python developer specializing in backend development, automation, APIs, and AI engineering.",
  url: siteUrl,
  knowsAbout: [
    "Python",
    "FastAPI",
    "Django",
    "Backend Development",
    "Automation",
    "APIs",
    "AI Engineering",
  ],
};

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const data = await getPortfolioData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="fixed left-2 top-2 z-[10001] -translate-y-24 rounded bg-accent px-4 py-2 text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Loader />
      <Navbar name={data.hero.name} />
      <main id="main">{children}</main>
      <Footer socialLinks={data.socialLinks} />
      <AIAssistant answers={data.aiAnswers} />
    </>
  );
}
