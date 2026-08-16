import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallButton } from "@/components/layout/FloatingCallButton";
import { DentalAgent } from "@/components/agent/DentalAgent";
import { SplashScreen } from "@/components/SplashScreen";
import { LocalBusinessSchema } from "@/components/schema/Schema";
import { MotionProvider } from "@/components/MotionProvider";
import { ClientEnhancements } from "@/components/providers/ClientEnhancements";
import { metaFor } from "@/lib/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.auroragentledentist.com"),
  ...metaFor("/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable}`}
      // The splash gate below adds `am-splash-seen` to <html> before React
      // hydrates, so on any repeat load in a session the client className
      // differs from the server's and React logs a hydration mismatch it
      // explicitly will not patch up. This is the documented escape hatch for
      // a pre-hydration script mutating the root element.
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        {/*
          Once-per-session splash gate. Runs before the splash element is
          parsed, so on repeat loads in the same session it marks <html> and
          the CSS hides the splash before first paint (no flash). First load of
          a session leaves it visible and sets the flag.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('am-splash-shown')){document.documentElement.classList.add('am-splash-seen')}else{sessionStorage.setItem('am-splash-shown','1')}}catch(e){}",
          }}
        />
        <SplashScreen />
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <FloatingCallButton />
          <DentalAgent />
          {/*
            ClientEnhancements is rendered AFTER Header/main/Footer so the
            skip link (first focusable in Header) is hit first by Tab. The
            SectionScrollIndicator renders anchor links that would otherwise
            steal initial focus from the skip link.
          */}
          <ClientEnhancements />
        </MotionProvider>
        <LocalBusinessSchema />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
