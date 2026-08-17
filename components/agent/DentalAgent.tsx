"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { LogoVideo } from "@/components/ui/LogoVideo";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { useMotion } from "@/lib/useMotion";

const PANEL_ID = "dental-agent-panel";
const GREETED_KEY = "ammari-agent-greeted";

type Suggestion = { label: string; href?: string; prompt?: string };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: Suggestion[];
};

const STORAGE_KEY = "ammari-agent-history";

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Hi, I'm the Ammari Dental assistant — I can answer questions about hours, services, insurance, and help you book a visit. How can I help?`,
  suggestions: [
    { label: "Book an appointment", prompt: "I'd like to book an appointment" },
    { label: "What are your hours?", prompt: "What are your hours?" },
    { label: "Do you take my insurance?", prompt: "Do you take my insurance?" },
    { label: "Tell me about teeth whitening", prompt: "Tell me about teeth whitening" },
  ],
};

function newId() {
  return Math.random().toString(36).slice(2);
}

// Read any saved session history lazily so we never call setState inside an
// effect on mount. The chat panel is gated behind `open` (false on first
// render) so the messages list is never in the SSR output — no hydration risk.
function loadInitialMessages(): Message[] {
  if (typeof window === "undefined") return [INITIAL_MESSAGE];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Message[];
      if (Array.isArray(saved) && saved.length) return saved;
    }
  } catch {
    /* ignore */
  }
  return [INITIAL_MESSAGE];
}

export function DentalAgent() {
  const { enabled: motionEnabled } = useMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadInitialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [unread, setUnread] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Show the "Chat with us" invite once per session, a beat after load, then
  // auto-retract. setState lives in async timers (not the effect body), so this
  // doesn't trip react-hooks/set-state-in-effect.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(GREETED_KEY)) return;
    } catch {
      /* ignore */
    }
    const showT = setTimeout(() => setShowLabel(true), 2000);
    const hideT = setTimeout(() => setShowLabel(false), 9000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  function dismissLabel() {
    setShowLabel(false);
    try {
      sessionStorage.setItem(GREETED_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  // Escape closes the panel and returns focus to the launcher (dialog pattern).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Bridge from the site-wide SearchPalette: opening the chat with a
  // pre-filled prompt is dispatched as `ammari:open-chat`. We keep a ref to
  // the latest `send` so the listener doesn't need to re-subscribe each render.
  const sendRef = useRef<(text: string) => void>(() => undefined);
  useEffect(() => {
    function onOpenChat(e: Event) {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail ?? {};
      // Inline openPanel's effects so the listener has no stale closure deps.
      setOpen(true);
      setUnread(false);
      setShowLabel(false);
      try {
        sessionStorage.setItem(GREETED_KEY, "1");
      } catch {
        /* ignore */
      }
      if (detail.prompt) {
        // Defer so the panel mounts + input focuses before we dispatch.
        setTimeout(() => sendRef.current(detail.prompt!), 120);
      }
    }
    window.addEventListener("ammari:open-chat", onOpenChat as EventListener);
    return () => window.removeEventListener("ammari:open-chat", onOpenChat as EventListener);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages]);

  // Focusing the input is a DOM-sync side effect (allowed). Clearing the
  // unread badge happens in openPanel() so we don't setState inside an effect.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  function openPanel() {
    setOpen(true);
    setUnread(false);
    dismissLabel();
  }

  // Keep the bridge ref pointed at the latest `send` (defined just below).
  useEffect(() => {
    sendRef.current = (text: string) => void send(text);
  });

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const userMsg: Message = { id: newId(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error(`agent responded ${res.status}`);
      const data = (await res.json()) as { reply: string; suggestions?: Suggestion[] };
      const reply: Message = {
        id: newId(),
        role: "assistant",
        content: data.reply,
        suggestions: data.suggestions,
      };
      setMessages((m) => [...m, reply]);
      if (!open) setUnread(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: newId(),
          role: "assistant",
          content: `Sorry — I had trouble responding. Please call ${site.phone} and we'll help right away.`,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function handleSuggestion(s: Suggestion) {
    if (s.prompt) {
      void send(s.prompt);
    }
  }

  function reset() {
    setMessages([INITIAL_MESSAGE]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {/* Floating launcher */}
      {/* Hidden below lg — the mobile quick-action bar owns the chat entry
          point there, and this bubble sat in the same corner. */}
      <div className="fixed z-40 bottom-5 right-5 hidden lg:flex items-center gap-2.5">
        {/* Invite label — slides in once per session to make the chat obvious */}
        <AnimatePresence>
          {showLabel && !open && (
            <m.div
              initial={{ opacity: 0, x: 16, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="hidden sm:flex items-center gap-2 rounded-full bg-white shadow-(--shadow-soft-lg) border border-(--color-brand-100) pl-4 pr-2.5 py-2.5"
            >
              <span className="text-sm font-medium text-(--color-ink-800) whitespace-nowrap">
                Questions? Chat with us
              </span>
              <button
                type="button"
                onClick={dismissLabel}
                aria-label="Dismiss"
                className="grid place-items-center w-5 h-5 rounded-full text-(--color-ink-400) hover:bg-(--color-surface-muted) hover:text-(--color-ink-700) transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </m.div>
          )}
        </AnimatePresence>

        {/* Launcher + animated attention rings */}
        <div className="relative w-16 h-16">
          {!open && motionEnabled && (
            <>
              <m.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-(--color-brand-500) pointer-events-none"
                animate={{ scale: [1, 1.65], opacity: [0.35, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
              <m.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-(--color-brand-500) pointer-events-none"
                animate={{ scale: [1, 1.65], opacity: [0.35, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 1.3 }}
              />
            </>
          )}

          <m.button
            ref={launcherRef}
            type="button"
            onClick={() => (open ? setOpen(false) : openPanel())}
            aria-label={open ? "Close dental assistant" : "Open dental assistant"}
            aria-expanded={open}
            aria-controls={PANEL_ID}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: !open && motionEnabled ? [0, -5, 0] : 0,
            }}
            transition={{
              opacity: { duration: 0.3, delay: 0.5 },
              scale: { type: "spring", stiffness: 260, damping: 18, delay: 0.5 },
              y: { repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 1.6 },
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
              "absolute inset-0 grid place-items-center rounded-full shadow-(--shadow-soft-lg) ring-1 transition-colors",
              open
                ? "bg-(--color-ink-800) text-white ring-(--color-ink-800)"
                : "bg-white ring-(--color-brand-100)"
            )}
          >
            {open ? (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <>
                <Image
                  src="/images/practice/ammaridentallogo.png"
                  alt=""
                  width={64}
                  height={64}
                  sizes="48px"
                  className="w-11 h-11 object-contain"
                />
                {/* Chat affordance badge — signals "this is a chat" */}
                <m.span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 grid place-items-center w-6 h-6 rounded-full bg-(--color-brand-600) text-white ring-2 ring-white shadow-(--shadow-soft-sm)"
                  animate={motionEnabled ? { rotate: [0, -12, 12, 0] } : undefined}
                  transition={{ repeat: Infinity, repeatDelay: 2.4, duration: 0.7, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </m.span>
              </>
            )}
            {unread && !open && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-(--color-accent-500) ring-2 ring-white z-10" />
            )}
          </m.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            key="panel"
            id={PANEL_ID}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            role="dialog"
            aria-modal="false"
            aria-label="Ammari Dental assistant"
            className={cn(
              "fixed z-40 bg-white rounded-3xl shadow-(--shadow-soft-lg) border border-(--color-brand-100) overflow-hidden flex flex-col",
              "bottom-24 right-5 left-5 sm:left-auto sm:w-[380px] max-h-[calc(100dvh-7rem)]"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-(--color-brand-700) to-(--color-brand-500) text-white px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/15 backdrop-blur shrink-0">
                <LogoVideo rounded />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg leading-tight">Ammari Dental Assistant</div>
                <div className="text-xs opacity-80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--color-success) shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-success)_25%,transparent)]" />
                  Usually replies instantly
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Start new conversation"
              >
                Reset
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-atomic="false"
              className="flex-1 overflow-y-auto px-4 py-5 bg-(--color-surface-warm) flex flex-col gap-3"
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} onSuggestion={handleSuggestion} />
              ))}
              {pending && (
                <m.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="self-start max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-(--color-brand-100) flex items-center gap-1.5"
                >
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </m.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-(--color-brand-100) bg-white p-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hours, services, booking…"
                aria-label="Message"
                className="flex-1 h-11 px-4 rounded-full bg-(--color-surface-muted) border border-transparent focus:border-(--color-brand-400) outline-none text-sm transition-colors"
                maxLength={500}
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label="Send message"
                className="grid place-items-center w-11 h-11 rounded-full bg-(--color-brand-600) text-white hover:bg-(--color-brand-700) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="arrow" className="w-4 h-4" />
              </button>
            </form>

            <div className="px-4 pb-3 text-[11px] text-(--color-ink-500) text-center bg-white">
              Not for medical advice — for urgent care call{" "}
              <a href={`tel:${site.phoneTel}`} className="underline">
                {site.phone}
              </a>
              .
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({
  msg,
  onSuggestion,
}: {
  msg: Message;
  onSuggestion: (s: Suggestion) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
          isUser
            ? "bg-(--color-brand-600) text-white rounded-br-sm"
            : "bg-white border border-(--color-brand-100) text-(--color-ink-900) rounded-bl-sm"
        )}
      >
        {msg.content}
      </div>
      {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-w-[90%]">
          {msg.suggestions.map((s) =>
            s.href ? (
              <Link
                key={s.label}
                href={s.href}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-(--color-brand-200) text-(--color-brand-700) hover:bg-(--color-brand-50) transition-colors"
              >
                {s.label}
              </Link>
            ) : (
              <button
                key={s.label}
                type="button"
                onClick={() => onSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-(--color-brand-200) text-(--color-brand-700) hover:bg-(--color-brand-50) transition-colors"
              >
                {s.label}
              </button>
            )
          )}
        </div>
      )}
    </m.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <m.span
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
      className="inline-block w-1.5 h-1.5 rounded-full bg-(--color-brand-500)"
    />
  );
}

