"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Mobile quick-action bar: Call · Book (center FAB) · Chat.
 *
 * Replaces the standalone floating call button, which sat on top of page
 * content and collided with the chat launcher in the same corner. Booking is
 * the centre FAB because it is the practice's conversion path; calling and the
 * assistant flank it.
 *
 * Shown below `lg`, matching the breakpoint the old call button used. The chat
 * launcher bubble is hidden over the same range so there is exactly one way in
 * to the assistant on mobile.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const onAppointment = pathname === "/appointment";

  function openChat() {
    window.dispatchEvent(new CustomEvent("ammari:open-chat"));
  }

  return (
    <nav
      aria-label="Quick actions"
      // Solid surface rather than a translucent blur: the bar sits over
      // arbitrary page content, and a semi-transparent background makes the
      // label contrast depend on whatever happens to be scrolled behind it.
      className="lg:hidden fixed inset-x-0 bottom-0 z-(--z-overlay) bg-(--color-surface) border-t border-(--color-brand-100) shadow-(--shadow-soft-lg) pb-[env(safe-area-inset-bottom)]"
    >
      {/* Positioned against the bar itself, not a grid cell — anchoring it to
          the cell pushed the FAB past the bottom of the viewport. */}
      <Link
        href="/appointment"
        aria-current={onAppointment ? "page" : undefined}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -top-6 grid place-items-center w-14 h-14 rounded-(--radius-pill)",
          "bg-(--color-brand-600) text-(--color-surface) shadow-(--shadow-soft-lg)",
          "ring-4 ring-(--color-surface) active:scale-95 transition-transform",
          onAppointment && "bg-(--color-brand-700)",
        )}
      >
        <Icon name="calendar" className="w-6 h-6" />
        <span className="sr-only">Book an appointment</span>
      </Link>

      <ul className="grid grid-cols-3 items-end h-16">
        <li className="flex">
          <a
            href={`tel:${site.phoneTel}`}
            aria-label={`Call ${site.phone}`}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-(--color-ink-700) active:scale-95 transition-transform"
          >
            <Icon name="phone" className="w-5 h-5" />
            <span className="text-[11px] font-semibold leading-none">Call</span>
          </a>
        </li>

        <li className="flex justify-center">
          {/* Label only — the FAB itself is anchored to the bar above. */}
          <span
            aria-hidden
            className="pb-2 text-[11px] font-semibold leading-none text-(--color-ink-700)"
          >
            Book
          </span>
        </li>

        <li className="flex">
          <button
            type="button"
            onClick={openChat}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-(--color-ink-700) active:scale-95 transition-transform"
          >
            <Icon name="chat" className="w-5 h-5" />
            <span className="text-[11px] font-semibold leading-none">Chat</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
