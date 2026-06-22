import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Henry A. | Software Engineer & Systems Architect",
    template: "%s | Henry A.",
  },
  description:
    "Personal blog, portfolio, and content platform of Henry A., a Principal Systems Architect specializing in distributed systems, event-driven architectures, and scalable platforms.",
  keywords: [
    "Software Engineer",
    "Systems Architect",
    "Distributed Systems",
    "Fintech",
    "SaaS",
    "Web Development",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Henry A." }],
  creator: "Henry A.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://henrydev.online",
    title: "Henry A. | Software Engineer & Systems Architect",
    description:
      "Personal blog, portfolio, and content platform of Henry A., specializing in distributed systems and fintech.",
    siteName: "Henry A. Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Henry A. | Software Engineer & Systems Architect",
    description:
      "Personal blog, portfolio, and content platform of Henry A., specializing in distributed systems and fintech.",
    creator: "@henry_dev",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-paper text-fg-ink font-sans transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 md:py-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
