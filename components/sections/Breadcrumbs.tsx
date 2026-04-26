import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[--color-ink-500]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="flex items-center gap-2">
              {it.href && !last ? (
                <Link href={it.href} className="hover:text-[--color-brand-700]">{it.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-[--color-ink-700] font-medium" : ""}>
                  {it.label}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
