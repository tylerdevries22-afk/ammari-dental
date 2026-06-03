"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { cn } from "@/lib/cn";

type Step = "await_name" | "await_contact" | "await_need" | "open";

type Session = {
  step: Step;
  lead_id: string | null;
  name: string | null;
};

type Message = {
  id: number;
  sender: "user" | "agent";
  text: string;
};

const GREETING: Message = {
  id: 0,
  sender: "agent",
  text: "Hi! I'm the Ammari Dental virtual assistant. I can help with appointments, services, insurance, and more. What's your name?",
};

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session>({
    step: "await_name",
    lead_id: null,
    name: null,
  });
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const userMsg: Message = { id: nextId.current++, sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session }),
      });
      const data = await res.json();
      const agentMsg: Message = { id: nextId.current++, sender: "agent", text: data.reply };
      setMessages((prev) => [...prev, agentMsg]);
      setSession(data.session);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, sender: "agent", text: "Sorry, something went wrong. Please call us at (303) 283-8009." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    sendMessage(text);
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-[9998] w-[340px] max-w-[calc(100vw-2rem)] flex flex-col",
          "bg-white rounded-2xl shadow-2xl border border-gray-100",
          "transition-all duration-300 origin-bottom-right",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
        )}
        style={{ maxHeight: "520px" }}
        role="dialog"
        aria-label="Ammari Dental chat"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[--color-brand-700] rounded-t-2xl">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🦷</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">Ammari Dental</p>
            <p className="text-blue-200 text-xs">Virtual assistant · Usually replies instantly</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0, maxHeight: "340px" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-2", msg.sender === "user" ? "justify-end" : "justify-start")}
            >
              {msg.sender === "agent" && (
                <div className="w-7 h-7 rounded-full bg-[--color-brand-100] flex items-center justify-center text-sm shrink-0 mt-0.5">
                  🦷
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line",
                  msg.sender === "user"
                    ? "bg-[--color-brand-600] text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm",
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-[--color-brand-100] flex items-center justify-center text-sm shrink-0">🦷</div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-3 pb-3">
          <div className="flex gap-2 items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[--color-brand-400] transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={loading}
              className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg bg-[--color-brand-600] hover:bg-[--color-brand-700] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-4 right-4 z-[9999] w-14 h-14 rounded-full shadow-lg",
          "bg-[--color-brand-600] hover:bg-[--color-brand-700] active:scale-95",
          "transition-all duration-200 flex items-center justify-center",
          "focus-visible:ring-2 focus-visible:ring-[--color-brand-400] focus-visible:ring-offset-2",
        )}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
