import { curriculumData, type ClassCurriculum } from "@/data/curriculum";

export interface SearchResult {
  type: "Class" | "Subject" | "Module" | "Topic";
  label: string;
  classId: number;
  subjectId?: string;
  moduleId?: string;
  topicId?: string;
  path: string;
}

interface IndexedItem {
  type: SearchResult["type"];
  label: string;
  classId: number;
  subjectId?: string;
  moduleId?: string;
  topicId?: string;
}

const INDEX: IndexedItem[] = (() => {
  const items: IndexedItem[] = [];
  for (const c of curriculumData) {
    items.push({ type: "Class", label: c.className, classId: c.id });
    for (const s of c.subjects) {
      items.push({ type: "Subject", label: s.name, classId: c.id, subjectId: s.id });
      for (const m of s.modules) {
        items.push({
          type: "Module",
          label: m.name,
          classId: c.id,
          subjectId: s.id,
          moduleId: m.id,
        });
        for (const t of m.topics) {
          items.push({
            type: "Topic",
            label: t.name,
            classId: c.id,
            subjectId: s.id,
            moduleId: m.id,
            topicId: t.id,
          });
        }
      }
    }
  }
  return items;
})();

function className(id: number): string {
  const c = curriculumData.find((x) => x.id === id);
  return c ? c.className : `Class ${id}`;
}
function subjectName(id: number, subjectId: string): string {
  const c = curriculumData.find((x) => x.id === id);
  return c?.subjects.find((s) => s.id === subjectId)?.name ?? subjectId;
}
function moduleName(id: number, subjectId: string, moduleId: string): string {
  const c = curriculumData.find((x) => x.id === id);
  return c?.subjects.find((s) => s.id === subjectId)?.modules.find((m) => m.id === moduleId)?.name ?? moduleId;
}

export function searchCurriculum(query: string, limit = 12): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = INDEX.filter((i) => i.label.toLowerCase().includes(q));
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const h of hits) {
    const key = `${h.type}:${h.classId}:${h.subjectId ?? ""}:${h.moduleId ?? ""}:${h.topicId ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const path =
      h.type === "Class"
        ? h.label
        : h.type === "Subject"
          ? `${h.type === "Subject" ? h.label : ""} in ${className(h.classId)}`
          : h.type === "Module"
            ? `${subjectName(h.classId, h.subjectId!)} · ${className(h.classId)}`
            : `${moduleName(h.classId, h.subjectId!, h.moduleId!)} · ${subjectName(h.classId, h.subjectId!)} · ${className(h.classId)}`;
    out.push({ ...h, path });
    if (out.length >= limit) break;
  }
  return out;
}

export function findClassClass(curriculumId: number): ClassCurriculum | undefined {
  return curriculumData.find((x) => x.id === curriculumId);
}

export function findSubject(c: ClassCurriculum, subjectId?: string) {
  return subjectId ? c.subjects.find((s) => s.id === subjectId) : undefined;
}

export function findModuleOf(c: ClassCurriculum, subjectId: string, moduleId: string) {
  return c.subjects.find((s) => s.id === subjectId)?.modules.find((m) => m.id === moduleId);
}

export function findTopicOf(c: ClassCurriculum, subjectId: string, moduleId: string, topicId: string) {
  return c.subjects
    .find((s) => s.id === subjectId)
    ?.modules.find((m) => m.id === moduleId)
    ?.topics.find((t) => t.id === topicId);
}