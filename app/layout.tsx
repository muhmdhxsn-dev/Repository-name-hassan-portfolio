import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://muhammadhassan.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hassan — Python Backend Engineer",
    template: "%s · Muhammad Hassan",
  },
  description:
    "Muhammad Hassan is a Python developer specializing in backend development, automation, and APIs — building toward AI engineering.",
  keywords: [
    "Muhammad Hassan",
    "Python Developer",
    "Backend Engineer",
    "API Developer",
    "Automation Engineer",
    "AI Engineer",
    "FastAPI",
    "Django",
  ],
  openGraph: {
    title: "Muhammad Hassan — Python Backend Engineer",
    description:
      "Backend systems, automation pipelines, and APIs — engineered in Python. On the road to AI Engineering.",
    url: siteUrl,
    siteName: "Muhammad Hassan",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hassan — Python Backend Engineer",
    description:
      "Backend systems, automation pipelines, and APIs — engineered in Python.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-[#050816] text-[#f5f6fa]">
        {children}
      </body>
    </html>
  );
}
