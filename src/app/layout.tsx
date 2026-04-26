import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ravok Studios",
  description: "A New Architecture for Entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${montserrat.variable} antialiased text-white cursor-none`}
      >
        {/* Fixed atmosphere layers — behind all content */}
        <div className="hero-atmosphere" aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="hgGold" cx="50%" cy="42%" r="55%">
                <stop offset="0%"   stopColor="rgba(196,149,58,0.28)" />
                <stop offset="55%"  stopColor="rgba(196,149,58,0.05)" />
                <stop offset="100%" stopColor="rgba(196,149,58,0)" />
              </radialGradient>
              <radialGradient id="hgVignette" cx="50%" cy="50%" r="75%">
                <stop offset="55%"  stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
              </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#hgGold)" />
            <rect width="1600" height="900" fill="url(#hgVignette)" />
          </svg>
        </div>
        {/* Film grain overlay */}
        <div className="film-grain" aria-hidden="true" />
        <CustomCursor />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-white/10 !border-white/20 !text-white backdrop-blur-xl",
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
