import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import LearningJourney from "@/components/sections/LearningJourney";
import Contact from "@/components/sections/Contact";
import { getPortfolioData } from "@/lib/db-queries";

const Terminal = dynamic(() => import("@/components/sections/Terminal"), {
  loading: () => <SectionSkeleton label="Loading terminal…" />,
});
const GithubDashboard = dynamic(
  () => import("@/components/sections/GithubDashboard"),
  { loading: () => <SectionSkeleton label="Loading GitHub data…" /> }
);

function SectionSkeleton({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 md:px-12">
      <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <p className="mt-3 font-mono text-xs text-muted">{label}</p>
    </div>
  );
}

export const revalidate = 0; // Ensure Server Component renders fresh database data on every request

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Hero data={data.hero} stats={data.stats} />
      <About cards={data.aboutCards} />
      <Skills list={data.skills} />
      <Projects list={data.projects} />
      <Terminal commands={data.terminalCommands} />
      <GithubDashboard username={data.hero.githubUsername} />
      <LearningJourney items={data.journey} />
      <Contact socialLinks={data.socialLinks} hero={data.hero} />
    </>
  );
}
