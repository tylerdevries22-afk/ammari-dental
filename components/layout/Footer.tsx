import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  return (
    <footer className="bg-(--color-ink-900) text-white mt-24">
      <Container className="py-16 grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 font-display text-xl">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-white p-1.5">
              <Image
                src="/images/practice/logo.webp"
                alt=""
                width={64}
                height={64}
                sizes="32px"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </span>
            <span>Ammari Dental</span>
          </Link>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Friendly staff. Beautiful smiles. Welcoming environment.
            <br />
            Family & cosmetic dentistry in Aurora, CO.
          </p>
          <a
            href={`tel:${site.phoneTel}`}
            className="mt-6 inline-flex items-center gap-2 text-lg font-semibold hover:text-(--color-brand-200)"
          >
            <Icon name="phone" className="w-4 h-4" />
            {site.phone}
          </a>
          <div className="mt-3 space-y-1 text-xs text-white/60">
            <div>
              <span className="text-white/50">Emergency: </span>
              <a href={`tel:${site.emergencyTel}`} className="hover:text-white">
                {site.emergencyPhone}
              </a>
            </div>
            <div>
              <span className="text-white/50">Fax: </span>
              {site.fax}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-sans font-semibold">Services</h4>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 9).map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="text-white/80 hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-sans font-semibold">More</h4>
          <ul className="space-y-2 text-sm">
            {services.slice(9).map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="text-white/80 hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-sans font-semibold">Practice</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/new-patients" className="text-white/80 hover:text-white">New Patients</Link></li>
            <li><Link href="/-new-patient-forms" className="text-white/80 hover:text-white">Forms</Link></li>
            <li><Link href="/dental-staff" className="text-white/80 hover:text-white">Meet the Doctor</Link></li>
            <li><Link href="/financing" className="text-white/80 hover:text-white">Financing</Link></li>
            <li><Link href="/reviews" className="text-white/80 hover:text-white">Reviews</Link></li>
            <li><Link href="/testimonials" className="text-white/80 hover:text-white">Testimonials</Link></li>
            <li><Link href="/gallery" className="text-white/80 hover:text-white">Gallery</Link></li>
            <li><Link href="/-q---a" className="text-white/80 hover:text-white">Q &amp; A</Link></li>
            <li><Link href="/educational-videos" className="text-white/80 hover:text-white">Educational Videos</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
          </ul>
          <div className="mt-6 text-sm text-white/70">
            <div>{site.address.street}</div>
            <div>
              {site.address.city}, {site.address.state} {site.address.zip}
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-white/60">
          <div>© {new Date().getFullYear()} Ammari Dental. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/notice-of-non-discrimination" className="hover:text-white">Non-Discrimination</Link>
            <Link href="/post-op-instructions" className="hover:text-white">Post-Op</Link>
            <Link href="/links" className="hover:text-white">Resources</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
