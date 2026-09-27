import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        const clickable = !last && (c.href || c.onClick);
        return (
          <Fragment key={i}>
            {i > 0 && <span className="text-slate-300">/</span>}
            {clickable ? (
              c.href ? (
                <Link
                  href={c.href}
                  onClick={c.onClick}
                  className="transition-colors hover:text-brand"
                >
                  {c.label}
                </Link>
              ) : (
                <button type="button" onClick={c.onClick} className="transition-colors hover:text-brand">
                  {c.label}
                </button>
              )
            ) : (
              <span className={last ? "font-semibold text-slate-800" : "text-slate-600"}>{c.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}