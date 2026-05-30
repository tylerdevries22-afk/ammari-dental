"use client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useMotion } from "@/lib/useMotion";
import {
  searchKB,
  idleSuggestions,
  type SearchItem,
  type SearchGroup,
  type SearchResult,
} from "@/lib/dental-kb";
import { cn } from "@/lib/cn";

/**
 * Site-wide smart search.
 *
 *  - Inline pill in the header (click to open) + ⌘K / Ctrl+K shortcut from anywhere.
 *  - Glass overlay (via portal so it escapes Header's transform stacking context).
 *  - Results pulled from `lib/dental-kb.ts` — the SAME engine + KB the chat uses.
 *  - "Continue in chat" CTA dispatches `ammari:open-chat` so the DentalAgent
 *    opens with the query pre-filled.
 *  - Full keyboard nav: ↑ ↓ to move, Enter to activate, Esc to close.
 *
 * The chat lives in the corner; this lives in the header. They share intent
 * matchers + every KB lookup via the shared module.
 */
// SSR-safe no-op subscriber for useSyncExternalStore platform reads.
const noopSubscribe = () => () => {};

export function SiteSearch() {
  const [open, setOpen] = useState(false);

  // ⌘K / Ctrl+K toggles the overlay from anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open) {
        // "/" focuses search when no input/textarea is focused (GitHub pattern).
        const tag = (document.activeElement?.tagName ?? "").toLowerCase();
        const editable = (document.activeElement as HTMLElement)?.isContentEditable;
        if (tag !== "input" && tag !== "textarea" && !editable) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <SearchPill onOpen={() => setOpen(true)} />
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && <SearchOverlay onClose={() => setOpen(false)} />}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

// ── Pill (the always-visible trigger in the header) ──────────────────────────

function SearchPill({ onOpen }: { onOpen: () => void }) {
  // SSR-safe platform read (no useEffect → setState round-trip).
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /(Mac|iPhone|iPad|iPod)/i.test(navigator.platform),
    () => false,
  );

  return (
    <>
      {/* Desktop / tablet pill — visible at md+ */}
      <button
        type="button"
        onClick={onOpen}
        aria-label="Search the site"
        aria-haspopup="dialog"
        className="hidden md:flex items-center gap-2.5 h-10 min-w-[220px] pl-3 pr-2 rounded-(--radius-pill) bg-(--color-surface)/70 backdrop-blur-sm border border-(--color-brand-100) text-sm text-(--color-ink-500) hover:text-(--color-ink-800) hover:bg-(--color-surface) hover:border-(--color-brand-300) hover:shadow-(--shadow-soft-sm) transition-all group"
      >
        <Icon name="search" className="w-4 h-4 text-(--color-brand-600) shrink-0" />
        <span className="flex-1 text-left truncate">Search or ask a question…</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 h-6 px-1.5 rounded-md bg-(--color-brand-50) border border-(--color-brand-100) text-[10px] font-mono font-semibold text-(--color-brand-700) tracking-wider group-hover:bg-(--color-brand-100) transition-colors">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      {/* Mobile — icon-only round button before the hamburger */}
      <button
        type="button"
        onClick={onOpen}
        aria-label="Search the site"
        aria-haspopup="dialog"
        className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-(--color-brand-100) bg-(--color-surface)/80 backdrop-blur-sm text-(--color-brand-700) hover:bg-(--color-surface) transition-colors"
      >
        <Icon name="search" className="w-4 h-4" />
      </button>
    </>
  );
}

// ── Overlay (glass card with grouped results) ────────────────────────────────

const OVERLAY_ID = "site-search-overlay";
const INPUT_ID = "site-search-input";
const LISTBOX_ID = "site-search-listbox";

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { reduced } = useMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount + lock body scroll while open.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, []);

  // Compute results / idle layout from the SHARED KB.
  const result: SearchResult | null = useMemo(() => {
    if (!query.trim()) return null;
    return searchKB(query, { perGroup: 5, total: 18 });
  }, [query]);

  const idle = useMemo(() => (query.trim() ? null : idleSuggestions()), [query]);

  // Flat list of all activatable items (smart-answer chips counted separately).
  const flatItems: SearchItem[] = useMemo(() => {
    if (result) return result.groups.flatMap((g) => g.items);
    if (idle) return [...idle.quickActions, ...idle.popular];
    return [];
  }, [result, idle]);

  // (Active index is reset inline in the input onChange handler — no effect.)

  const askInChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      // Bridge to the DentalAgent — it listens for this and opens with the prompt.
      window.dispatchEvent(
        new CustomEvent("ammari:open-chat", { detail: { prompt: trimmed } }),
      );
      onClose();
    },
    [onClose],
  );

  const activate = useCallback(
    (item: SearchItem) => {
      if (item.href) {
        // Let the browser/router handle navigation; just clean up.
        onClose();
      } else if (item.chatPrompt) {
        askInChat(item.chatPrompt);
      } else {
        askInChat(item.title);
      }
    },
    [askInChat, onClose],
  );

  // Global keyboard handling for the overlay.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(flatItems.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      const item = flatItems[active];
      if (item) {
        e.preventDefault();
        if (item.href) {
          // Programmatic navigation via Link is in the markup; click the row.
          const el = document.getElementById(`search-row-${active}`) as HTMLAnchorElement | null;
          if (el) el.click();
        } else {
          activate(item);
        }
      } else if (query.trim()) {
        askInChat(query);
      }
    }
  }

  // Smart-answer suggestion chip click — link or chat prompt.
  function onSuggestionClick(s: { label: string; href?: string; prompt?: string }) {
    if (s.href) {
      onClose();
      // Soft-navigate by setting location — works for tel: links too.
      window.location.href = s.href;
    } else if (s.prompt) {
      askInChat(s.prompt);
    }
  }

  // Build the rendered row list, flattening for arrow-key index mapping.
  let rowIndex = 0;

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={INPUT_ID}
      id={OVERLAY_ID}
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-start justify-center px-3 sm:px-6 pt-[68px] sm:pt-[88px] bg-(--color-ink-900)/45 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <m.div
        initial={reduced ? { y: 0, scale: 1 } : { y: -12, scale: 0.985, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={reduced ? { y: 0, opacity: 0 } : { y: -8, scale: 0.99, opacity: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] rounded-(--radius-xl) bg-(--color-surface)/95 backdrop-blur-xl border border-(--color-brand-100) shadow-(--shadow-soft-lg) overflow-hidden flex flex-col max-h-[min(72vh,640px)]"
      >
        {/* Header: input + close */}
        <div className="flex items-center gap-3 px-4 sm:px-5 h-14 border-b border-(--color-brand-100)/70 bg-gradient-to-br from-(--color-brand-50)/40 to-transparent">
          <Icon name="search" className="w-4 h-4 text-(--color-brand-600) shrink-0" />
          <input
            id={INPUT_ID}
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search services, articles, hours — or ask a question…"
            aria-label="Search the site"
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              flatItems.length ? `search-row-${active}` : undefined
            }
            role="combobox"
            aria-expanded="true"
            className="flex-1 h-full bg-transparent outline-none text-(--color-ink-900) placeholder:text-(--color-ink-400) text-[15px]"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center h-6 px-2 rounded-md bg-(--color-brand-50) border border-(--color-brand-100) text-[10px] font-mono font-semibold text-(--color-brand-700) tracking-wider">
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="sm:hidden grid place-items-center w-8 h-8 rounded-full text-(--color-ink-500) hover:bg-(--color-brand-50) hover:text-(--color-ink-800) transition-colors"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Body — idle state OR results */}
        <div
          ref={listRef}
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto px-2 sm:px-3 py-3 [scrollbar-width:thin]"
        >
          {/* SMART ANSWER (intent-driven, shared with chat) */}
          {result?.intentAnswer && (
            <SmartAnswerCard
              query={result.query}
              reply={result.intentAnswer.reply}
              suggestions={result.intentAnswer.suggestions ?? []}
              onSuggestion={onSuggestionClick}
              onAsk={() => askInChat(result.query)}
            />
          )}

          {/* IDLE STATE — quick actions + popular services */}
          {idle && (
            <>
              <GroupHeader label="Quick actions" />
              <div className="px-1 pb-2 pt-1 grid grid-cols-2 gap-1.5">
                {idle.quickActions.map((item) => {
                  const i = rowIndex++;
                  return (
                    <QuickActionCard
                      key={item.id}
                      id={`search-row-${i}`}
                      item={item}
                      isActive={i === active}
                      onHover={() => setActive(i)}
                      onActivate={() => activate(item)}
                    />
                  );
                })}
              </div>
              <GroupHeader label="Popular services" />
              <div className="px-1">
                {idle.popular.map((item) => {
                  const i = rowIndex++;
                  return (
                    <ResultRow
                      key={item.id}
                      id={`search-row-${i}`}
                      item={item}
                      isActive={i === active}
                      onHover={() => setActive(i)}
                      onActivate={() => activate(item)}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* RESULTS */}
          {result && result.groups.length > 0 && (
            <>
              {result.groups.map((group: SearchGroup) => (
                <div key={group.kind}>
                  <GroupHeader label={group.label} />
                  <div className="px-1">
                    {group.items.map((item) => {
                      const i = rowIndex++;
                      return (
                        <ResultRow
                          key={item.id}
                          id={`search-row-${i}`}
                          item={item}
                          isActive={i === active}
                          onHover={() => setActive(i)}
                          onActivate={() => activate(item)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* EMPTY (typed query, no matches) */}
          {result && result.groups.length === 0 && !result.intentAnswer && (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto w-12 h-12 grid place-items-center rounded-full bg-(--color-brand-50) text-(--color-brand-600) mb-3">
                <Icon name="search" className="w-5 h-5" />
              </div>
              <div className="font-display text-lg text-(--color-ink-900)">
                No matches for &ldquo;{result.query}&rdquo;
              </div>
              <p className="mt-1.5 text-sm text-(--color-ink-500) max-w-sm mx-auto">
                Try a service name like &ldquo;implants,&rdquo; ask about hours, or send
                your question to the assistant.
              </p>
            </div>
          )}
        </div>

        {/* Footer — bridge to chat + keyboard legend */}
        <div className="border-t border-(--color-brand-100)/70 bg-(--color-surface)/70 backdrop-blur-sm">
          {query.trim() && (
            <button
              type="button"
              onClick={() => askInChat(query)}
              className="group w-full flex items-center gap-3 px-4 sm:px-5 py-3 text-left bg-gradient-to-br from-(--color-brand-700) to-(--color-brand-500) text-white hover:from-(--color-brand-800) hover:to-(--color-brand-600) transition-colors"
            >
              <span className="grid place-items-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] uppercase tracking-widest font-semibold opacity-80">
                  Continue in chat
                </span>
                <span className="block text-sm font-medium truncate">
                  Ask the assistant: &ldquo;{query}&rdquo;
                </span>
              </span>
              <Icon name="arrow" className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-[11px] text-(--color-ink-500)">
            <div className="flex items-center gap-3">
              <KbdHint k="↑" /> <KbdHint k="↓" /> <span>navigate</span>
              <KbdHint k="↵" /> <span>select</span>
              <KbdHint k="esc" /> <span>close</span>
            </div>
            <span className="hidden sm:inline opacity-70">
              Shared with Ammari Dental Assistant
            </span>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function GroupHeader({ label }: { label: string }) {
  return (
    <div className="px-3 pt-3 pb-1.5 eyebrow text-(--color-brand-600)">{label}</div>
  );
}

function ResultRow({
  id,
  item,
  isActive,
  onHover,
  onActivate,
}: {
  id: string;
  item: SearchItem;
  isActive: boolean;
  onHover: () => void;
  onActivate: () => void;
}) {
  const className = cn(
    "group flex items-center gap-3 px-2.5 py-2 rounded-(--radius-md) transition-colors cursor-pointer",
    isActive
      ? "bg-(--color-brand-50) text-(--color-brand-800)"
      : "hover:bg-(--color-brand-50)/60 text-(--color-ink-800)",
  );
  const inner = (
    <>
      <span
        className={cn(
          "grid place-items-center w-9 h-9 rounded-(--radius-md) shrink-0 transition-colors",
          isActive
            ? "bg-(--color-brand-600) text-white"
            : "bg-(--color-brand-50) text-(--color-brand-700) group-hover:bg-(--color-brand-100)",
        )}
      >
        <Icon name={item.icon} className="w-4 h-4" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium truncate">{item.title}</span>
        {item.subtitle && (
          <span className="block text-xs text-(--color-ink-500) truncate">
            {item.subtitle}
          </span>
        )}
      </span>
      <Icon
        name={item.href ? "arrow" : "enter"}
        className={cn(
          "w-3.5 h-3.5 shrink-0 transition-opacity",
          isActive ? "opacity-90" : "opacity-0 group-hover:opacity-70",
        )}
      />
    </>
  );
  return item.href ? (
    <Link
      id={id}
      href={item.href}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onActivate}
      className={className}
      target={item.href.startsWith("http") || item.href.startsWith("tel:") ? "_self" : undefined}
    >
      {inner}
    </Link>
  ) : (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onActivate}
      className={cn(className, "w-full text-left")}
    >
      {inner}
    </button>
  );
}

function QuickActionCard({
  id,
  item,
  isActive,
  onHover,
  onActivate,
}: {
  id: string;
  item: SearchItem;
  isActive: boolean;
  onHover: () => void;
  onActivate: () => void;
}) {
  const className = cn(
    "group flex items-center gap-2.5 px-3 py-2.5 rounded-(--radius-lg) border transition-all",
    isActive
      ? "bg-(--color-brand-50) border-(--color-brand-400) shadow-(--shadow-soft-sm)"
      : "bg-(--color-surface) border-(--color-brand-100) hover:border-(--color-brand-300) hover:shadow-(--shadow-soft-sm)",
  );
  const inner = (
    <>
      <span className="grid place-items-center w-8 h-8 rounded-(--radius-md) bg-(--color-brand-50) text-(--color-brand-700) shrink-0 group-hover:bg-(--color-brand-100) transition-colors">
        <Icon name={item.icon} className="w-4 h-4" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-(--color-ink-900) truncate">
          {item.title}
        </span>
        {item.subtitle && (
          <span className="block text-[11px] text-(--color-ink-500) truncate">
            {item.subtitle}
          </span>
        )}
      </span>
    </>
  );
  return item.href ? (
    <Link
      id={id}
      href={item.href}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onActivate}
      className={className}
    >
      {inner}
    </Link>
  ) : (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onActivate}
      className={cn(className, "text-left")}
    >
      {inner}
    </button>
  );
}

function SmartAnswerCard({
  query,
  reply,
  suggestions,
  onSuggestion,
  onAsk,
}: {
  query: string;
  reply: string;
  suggestions: { label: string; href?: string; prompt?: string }[];
  onSuggestion: (s: { label: string; href?: string; prompt?: string }) => void;
  onAsk: () => void;
}) {
  return (
    <div className="mx-1 my-2 p-4 rounded-(--radius-lg) border border-(--color-brand-200) bg-gradient-to-br from-(--color-brand-50) via-(--color-surface) to-(--color-surface) shadow-(--shadow-soft-sm)">
      <div className="flex items-center gap-2 eyebrow text-(--color-brand-700) mb-1.5">
        <Icon name="sparkle" className="w-3.5 h-3.5" />
        Smart answer
      </div>
      <p className="text-sm leading-relaxed text-(--color-ink-800) whitespace-pre-line">
        {reply}
      </p>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onSuggestion(s)}
              className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-(--color-surface) border border-(--color-brand-200) text-(--color-brand-700) hover:bg-(--color-brand-50) hover:border-(--color-brand-400) transition-colors"
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onAsk}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-(--color-brand-700) text-white hover:bg-(--color-brand-800) transition-colors"
          >
            Ask &ldquo;{query.length > 24 ? query.slice(0, 24) + "…" : query}&rdquo; in chat
            <Icon name="arrow" className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function KbdHint({ k }: { k: string }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded bg-(--color-brand-50) border border-(--color-brand-100) text-[10px] font-mono font-semibold text-(--color-brand-700)">
      {k}
    </kbd>
  );
}
