import { curriculumData } from "@/data/curriculum";
import JourneyExplorer from "@/components/JourneyExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Learning Journey · Edu Alt Tech Curriculum",
  description: "Browse every class, subject, module and topic of the Edu Alt Tech Future Skills curriculum.",
};

export default function CurriculumPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="pt-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Journey" }]} />
      </div>
      <header className="pt-6">
        <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Learning Journey</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Ten classes, four stage-gated levels. Pick a class to walk its syllabus flow, or filter by batch and subject,
          or search across every topic in the programme.
        </p>
      </header>
      <div className="mt-8">
        <JourneyExplorer classes={curriculumData} />
      </div>
    </main>
  );
}