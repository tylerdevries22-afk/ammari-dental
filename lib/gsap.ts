"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Idempotent registration — fine to import this module multiple times.
if (typeof window !== "undefined" && !(gsap as { _scrollTriggerRegistered?: boolean })._scrollTriggerRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  (gsap as { _scrollTriggerRegistered?: boolean })._scrollTriggerRegistered = true;
}

export { gsap, ScrollTrigger };
