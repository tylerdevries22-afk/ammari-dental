"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      setInfo("Check your email to confirm your account, then log in.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-(--color-surface-warm) flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-(--color-brand-100) overflow-hidden">

          {/* Header */}
          <div className="bg-(--color-brand-700) px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                <Image src="/images/practice/ammaridentallogo.png" alt="" width={40} height={40} className="object-contain" unoptimized />
              </div>
            </div>
            <h1 className="text-white font-display text-2xl font-semibold">Ammari Dental</h1>
            <p className="text-blue-200 text-sm mt-1">AI Agent Suite — Staff Portal</p>
          </div>

          {/* Toggle */}
          <div className="flex border-b border-(--color-brand-100)">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setInfo(""); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "text-(--color-brand-700) border-b-2 border-(--color-brand-600)"
                    : "text-(--color-ink-500) hover:text-(--color-ink-700)"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {info && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                {info}
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-(--color-ink-600) mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-(--color-brand-200) bg-(--color-surface) text-(--color-ink-900) text-sm outline-none focus:ring-2 focus:ring-(--color-brand-400) focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--color-ink-600) mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-(--color-brand-200) bg-(--color-surface) text-(--color-ink-900) text-sm outline-none focus:ring-2 focus:ring-(--color-brand-400) focus:border-transparent transition placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-(--color-brand-600) hover:bg-(--color-brand-700) text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </form>

          <p className="px-8 pb-6 text-center text-xs text-(--color-ink-400)">
            Staff access only · Ammari Dental AI Agent Suite
          </p>
        </div>
      </div>
    </div>
  );
}
