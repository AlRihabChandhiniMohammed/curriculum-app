"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LEVEL_META, type ClassCurriculum, type Topic } from "@/data/curriculum";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import FlowPipeline from "@/components/FlowPipeline";
import SyllabusFlow from "@/components/SyllabusFlow";
import SubjectsOverview from "@/components/SubjectsOverview";
import ProjectsView from "@/components/ProjectsView";
import TopicDetailDrawer from "@/components/TopicDetailDrawer";
import { cx } from "@/lib/utils";

const TABS = [
  { id: "flow", label: "Syllabus Flow" },
  { id: "subjects", label: "Subjects" },
  { id: "projects", label: "Projects" },
] as const;

export interface DeepLink {
  subject?: string;
  module?: string;
  topic?: string;
  tab?: string;
}

export default function ClassSyllabus({
  c,
  initial,
}: {
  c: ClassCurriculum;
  initial: DeepLink;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const meta = LEVEL_META[c.level];

  const initialTab =
    initial.tab === "subjects" || initial.tab === "projects"
      ? initial.tab
      : "flow";

  const [tab, setTab] = useState<string>(initialTab);
  const [selSubject, setSelSubject] = useState<string | null>(initial.subject ?? null);
  const [selModule, setSelModule] = useState<string | null>(initial.module ?? null);
  const [openTopic, setOpenTopic] = useState<Topic | null>(() => {
    if (!initial.topic || !initial.subject || !initial.module) return null;
    return (
      c.subjects
        .find((s) => s.id === initial.subject)
        ?.modules.find((m) => m.id === initial.module)
        ?.topics.find((t) => t.id === initial.topic) ?? null
    );
  });

  const subject = selSubject ? c.subjects.find((s) => s.id === selSubject) : null;
  const mod = selSubject && selModule ? subject?.modules.find((m) => m.id === selModule) : null;

  const syncUrl = useCallback(
    (next: DeepLink & { tab: string }) => {
      const params = new URLSearchParams();
      if (next.tab && next.tab !== "flow") params.set("tab", next.tab);
      if (next.subject) params.set("subject", next.subject);
      if (next.module) params.set("module", next.module);
      if (next.topic) params.set("topic", next.topic);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  function changeTab(id: string) {
    setTab(id);
    syncUrl({ tab: id, subject: selSubject ?? undefined, module: selModule ?? undefined, topic: openTopic?.id });
  }
  function selectSubject(id: string) {
    const next = { tab, subject: id, module: undefined, topic: undefined };
    setSelSubject(id);
    setSelModule(null);
    setOpenTopic(null);
    syncUrl(next);
  }
  function deselectSubject() {
    setSelSubject(null);
    setSelModule(null);
    setOpenTopic(null);
    syncUrl({ tab, subject: undefined, module: undefined, topic: undefined });
  }
  function selectModule(id: string) {
    const next = { tab, subject: selSubject ?? undefined, module: id, topic: undefined };
    setSelModule(id);
    setOpenTopic(null);
    syncUrl(next);
  }
  function deselectModule() {
    setSelModule(null);
    setOpenTopic(null);
    syncUrl({ tab, subject: selSubject ?? undefined, module: undefined, topic: undefined });
  }
  function openTopicDetail(topicId: string, moduleId: string) {
    if (!subject) return;
    const t = subject.modules.find((m) => m.id === moduleId)?.topics.find((x) => x.id === topicId);
    if (!t) return;
    setSelModule(moduleId);
    setOpenTopic(t);
    syncUrl({ tab, subject: selSubject ?? undefined, module: moduleId, topic: topicId });
  }
  function closeTopicDetail() {
    setOpenTopic(null);
    syncUrl({ tab, subject: selSubject ?? undefined, module: selModule ?? undefined, topic: undefined });
  }
  function resetToClass() {
    setSelSubject(null);
    setSelModule(null);
    setOpenTopic(null);
    syncUrl({ tab, subject: undefined, module: undefined, topic: undefined });
  }

  const crumbs = useMemo<Crumb[]>(() => {
    const list: Crumb[] = [
      { label: "Learning Journey", href: "/curriculum" },
      { label: c.className, onClick: resetToClass },
    ];
    if (subject) {
      list.push({ label: subject.name, onClick: deselectSubject });
      if (mod) {
        list.push({ label: mod.name, onClick: deselectModule });
        if (openTopic) list.push({ label: openTopic.name });
      }
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, mod, openTopic]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="py-5">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className={cx("hero-tile rounded-[2rem] bg-gradient-to-br p-6 text-white shadow-lg sm:p-10", c.theme)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-white/75">
              Edu Alt Tech · Future Skills
            </div>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">{c.className}</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-white/85 sm:text-base">{c.tagline}</p>
          </div>
          <span className={cx("rounded-full border px-3 py-1.5 text-xs font-bold", meta.chip)}>{c.level}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
          {[
            `${c.stats.subjects} subjects`,
            `${c.stats.modules} modules`,
            `${c.stats.topics} topics`,
            `~${c.stats.hours} sessions`,
          ].map((chip) => (
            <span key={chip} className="rounded-full bg-white/15 px-3 py-1 font-bold backdrop-blur">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-16 z-30 -mx-4 border-b border-slate-200 bg-[var(--bg)]/90 px-4 backdrop-blur sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar pt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => changeTab(t.id)}
              className={cx(
                "whitespace-nowrap rounded-t-2xl px-4 py-2.5 text-sm font-bold transition-colors",
                tab === t.id
                  ? "border-b-2 border-brand text-brand-dark"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {tab === "flow" && (
          <>
            <div className="mb-6 overflow-x-auto no-scrollbar rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
              <FlowPipeline />
            </div>
            <SyllabusFlow
              subjects={c.subjects}
              selSubject={selSubject}
              selModule={selModule}
              onSelectSubject={selectSubject}
              onSelectModule={selectModule}
              onDeselectSubject={deselectSubject}
              onDeselectModule={deselectModule}
              onOpenTopic={openTopicDetail}
            />
          </>
        )}
        {tab === "subjects" && (
          <SubjectsOverview subjects={c.subjects} onOpenTopic={openTopicDetail} />
        )}
        {tab === "projects" && <ProjectsView c={c} />}
      </div>

      <TopicDetailDrawer
        topic={openTopic}
        accentKey={subject?.accent}
        context={
          subject && mod
            ? { subject: subject.name, module: mod.name }
            : subject
              ? { subject: subject.name, module: "" }
              : undefined
        }
        onClose={closeTopicDetail}
      />
    </div>
  );
}