"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Lead, Conversation, Appointment, AiEvent } from "@/lib/types/db";

type Tab = "leads" | "conversations" | "appointments" | "events";

const STATUS_COLORS: Record<string, string> = {
  hot:                    "bg-red-100 text-red-700",
  warm:                   "bg-orange-100 text-orange-700",
  new:                    "bg-blue-100 text-blue-700",
  chat_started:           "bg-purple-100 text-purple-700",
  contact_collected:      "bg-indigo-100 text-indigo-700",
  need_identified:        "bg-yellow-100 text-yellow-700",
  appointment_requested:  "bg-green-100 text-green-700",
  default:                "bg-gray-100 text-gray-600",
};

function badge(status: string) {
  const cls = STATUS_COLORS[status] ?? STATUS_COLORS.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [events, setEvents] = useState<AiEvent[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUserEmail(data.user.email ?? "");
    });
  }, [router]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [l, c, a, e] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("conversations").select("*").order("timestamp", { ascending: false }).limit(100),
        supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("ai_events").select("*").order("timestamp", { ascending: false }).limit(100),
      ]);
      setLeads(l.data ?? []);
      setConvos(c.data ?? []);
      setAppts(a.data ?? []);
      setEvents(e.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "leads",         label: "Leads",         count: leads.length },
    { key: "conversations", label: "Conversations",  count: convos.length },
    { key: "appointments",  label: "Appointments",   count: appts.length },
    { key: "events",        label: "AI Events",      count: events.length },
  ];

  const hotLeads  = leads.filter((l) => l.status === "hot").length;
  const warmLeads = leads.filter((l) => l.status === "warm").length;

  return (
    <div className="min-h-screen bg-(--color-surface-warm)">

      {/* Top bar */}
      <div className="bg-(--color-brand-700) text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">AI Agent Suite</h1>
          <p className="text-blue-200 text-xs mt-0.5">Ammari Dental · Staff Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200 hidden sm:block">{userEmail}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads",    value: leads.length,  color: "text-(--color-brand-700)" },
            { label: "Hot Leads 🔥",   value: hotLeads,      color: "text-red-600" },
            { label: "Warm Leads",     value: warmLeads,     color: "text-orange-500" },
            { label: "Appointments",   value: appts.length,  color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-(--color-brand-100) p-5 shadow-sm">
              <div className={`text-3xl font-display font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-(--color-ink-500) mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-(--color-brand-100) p-1 w-fit shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                tab === t.key
                  ? "bg-(--color-brand-600) text-white shadow-sm"
                  : "text-(--color-ink-600) hover:bg-(--color-brand-50)"
              }`}
            >
              {t.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? "bg-white/20 text-white" : "bg-(--color-brand-100) text-(--color-brand-700)"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-(--color-brand-100) p-12 text-center text-(--color-ink-400)">
            Loading…
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-(--color-brand-100) shadow-sm overflow-hidden">

            {tab === "leads" && (
              <table className="w-full text-sm">
                <thead className="bg-(--color-surface-warm) border-b border-(--color-brand-100)">
                  <tr>
                    {["Name", "Phone", "Email", "Service", "Urgency", "Status", "Created"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-(--color-ink-500) uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-brand-50)">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-(--color-brand-50)/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-(--color-ink-900)">{l.name ?? "—"}</td>
                      <td className="px-4 py-3 text-(--color-ink-600)">{l.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-(--color-ink-600)">{l.email ?? "—"}</td>
                      <td className="px-4 py-3 text-(--color-ink-600)">{l.service_interest ?? "—"}</td>
                      <td className="px-4 py-3">{l.urgency ? badge(l.urgency) : "—"}</td>
                      <td className="px-4 py-3">{badge(l.status)}</td>
                      <td className="px-4 py-3 text-(--color-ink-400) text-xs">{fmt(l.created_at)}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-(--color-ink-400)">No leads yet</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {tab === "conversations" && (
              <table className="w-full text-sm">
                <thead className="bg-(--color-surface-warm) border-b border-(--color-brand-100)">
                  <tr>
                    {["Sender", "Message", "Time"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-(--color-ink-500) uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-brand-50)">
                  {convos.map((c) => (
                    <tr key={c.id} className="hover:bg-(--color-brand-50)/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${c.sender === "agent" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                          {c.sender === "agent" ? "🦷 Agent" : "👤 User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-(--color-ink-700) max-w-xl">{c.message}</td>
                      <td className="px-4 py-3 text-(--color-ink-400) text-xs whitespace-nowrap">{fmt(c.timestamp)}</td>
                    </tr>
                  ))}
                  {convos.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-10 text-center text-(--color-ink-400)">No conversations yet</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {tab === "appointments" && (
              <table className="w-full text-sm">
                <thead className="bg-(--color-surface-warm) border-b border-(--color-brand-100)">
                  <tr>
                    {["Type", "Start Time", "Status", "Created"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-(--color-ink-500) uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-brand-50)">
                  {appts.map((a) => (
                    <tr key={a.id} className="hover:bg-(--color-brand-50)/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-(--color-ink-900)">{a.type ?? "—"}</td>
                      <td className="px-4 py-3 text-(--color-ink-600)">{a.start_time ? fmt(a.start_time) : "—"}</td>
                      <td className="px-4 py-3">{badge(a.status)}</td>
                      <td className="px-4 py-3 text-(--color-ink-400) text-xs">{fmt(a.created_at)}</td>
                    </tr>
                  ))}
                  {appts.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-(--color-ink-400)">No appointments yet</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {tab === "events" && (
              <table className="w-full text-sm">
                <thead className="bg-(--color-surface-warm) border-b border-(--color-brand-100)">
                  <tr>
                    {["Event", "Payload", "Agent", "Time"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-(--color-ink-500) uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-brand-50)">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-(--color-brand-50)/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${e.event_type?.includes("hot") ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}`}>
                          {e.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-(--color-ink-500) text-xs font-mono max-w-sm truncate">
                        {JSON.stringify(e.payload)}
                      </td>
                      <td className="px-4 py-3 text-(--color-ink-400) text-xs">{e.agent_id}</td>
                      <td className="px-4 py-3 text-(--color-ink-400) text-xs whitespace-nowrap">{fmt(e.timestamp)}</td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-(--color-ink-400)">No events yet</td></tr>
                  )}
                </tbody>
              </table>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
