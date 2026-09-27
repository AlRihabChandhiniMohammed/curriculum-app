import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClass } from "@/data/curriculum";
import ClassSyllabus, { type DeepLink } from "@/components/ClassSyllabus";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classId: string }>;
}): Promise<Metadata> {
  const { classId } = await params;
  const c = getClass(Number(classId));
  if (!c) return { title: "Class not found" };
  return {
    title: `${c.className} Syllabus · Edu Alt Tech Curriculum`,
    description: c.tagline,
  };
}

export default async function ClassPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ subject?: string; module?: string; topic?: string; tab?: string }>;
}) {
  const [{ classId }, sp] = await Promise.all([params, searchParams]);
  const id = Number(classId);
  const c = getClass(id);
  if (!c) notFound();

  const subject = sp.subject && c.subjects.some((s) => s.id === sp.subject) ? sp.subject : undefined;
  const subjectObj = subject ? c.subjects.find((s) => s.id === subject) : undefined;
  const mod =
    subject && sp.module && subjectObj?.modules.some((m) => m.id === sp.module) ? sp.module : undefined;
  const moduleObj = subject && mod ? subjectObj?.modules.find((m) => m.id === mod) : undefined;
  const topic =
    subject && mod && sp.topic && moduleObj?.topics.some((t) => t.id === sp.topic) ? sp.topic : undefined;

  const initial: DeepLink = {
    tab: sp.tab === "subjects" || sp.tab === "projects" ? sp.tab : undefined,
    subject,
    module: mod,
    topic,
  };

  return (
    <main>
      <ClassSyllabus c={c} initial={initial} />
    </main>
  );
}