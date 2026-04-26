import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32">
      <Container className="text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-3 text-5xl lg:text-6xl font-display tracking-tight">Page not found</h1>
        <p className="mt-5 text-lg text-(--color-ink-700) max-w-xl mx-auto">
          The page you&rsquo;re looking for doesn&rsquo;t exist. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to Home</Button>
          <Button href="/dental-services" variant="secondary">Browse Services</Button>
          <Button href="/appointment" variant="ghost">Book Appointment</Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          {[
            { label: "Contact", href: "/contact" },
            { label: "Reviews", href: "/reviews" },
            { label: "New Patients", href: "/new-patients" },
            { label: "Q & A", href: "/-q---a" },
          ].map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-(--color-brand-700) hover:underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
