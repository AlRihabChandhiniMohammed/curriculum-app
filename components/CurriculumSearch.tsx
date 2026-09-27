"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCurriculum, type SearchResult } from "@/lib/search";
import { cx } from "@/lib/utils";

const TYPE_STYLES: Record<SearchResult["type"], string> = {
  Class: "bg-slate-900 text-white",
  Subject: "bg-violet-100 text-violet-700",
  Module: "bg-teal-100 text-teal-700",
  Topic: "bg-rose-100 text-rose-700",
};

export default function CurriculumSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (query.trim() ? searchCurriculum(query) : []), [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function go(r: SearchResult) {
    const q = new URLSearchParams();
    if (r.subjectId) q.set("subject", r.subjectId);
    if (r.moduleId) q.set("module", r.moduleId);
    if (r.topicId) q.set("topic", r.topicId);
    router.push(`/curriculum/class/${r.classId}?${q.toString()}`);
    setOpen(false);
    setQuery("");
    setHighlight(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[highlight >= 0 ? highlight : 0];
      if (r) go(r);
    } else if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:border-brand focus-within:shadow-md">
        <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M9 3a6 6 0 104.472 10.06l3.234 3.234a1 1 0 001.414-1.414l-3.234-3.234A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={query}
          placeholder="Search topics, modules or classes…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(-1);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] text-slate-500 transition-colors hover:bg-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <ul className="max-h-80 overflow-y-auto thin-scroll py-1">
            {results.map((r, i) => (
              <li key={`${r.type}-${r.classId}-${r.subjectId ?? ""}-${r.moduleId ?? ""}-${r.topicId ?? ""}`}>
                <button
                  type="button"
                  onClick={() => go(r)}
                  onMouseEnter={() => setHighlight(i)}
                  className={cx(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    i === highlight ? "bg-slate-50" : "bg-white"
                  )}
                >
                  <span className={cx("w-14 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-bold", TYPE_STYLES[r.type])}>
                    {r.type}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">{r.label}</span>
                    <span className="block truncate text-xs text-slate-400">{r.path}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-40 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-xl">
          No matches for &ldquo;{query.trim()}&rdquo;
        </div>
      )}
    </div>
  );
}