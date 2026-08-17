import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sougata Chanda | Full-Stack Software Developer & Systems Architect",
  description: "Portfolio of Sougata Chanda. Full-stack software engineer specializing in modern web applications, low-latency microservices, cloud infrastructure, and AI products.",
  keywords: ["Software Engineer", "Full-Stack Developer", "Next.js 15", "TypeScript", "React", "Rust", "AWS", "Systems Architect", "Bangalore Developer"],
  authors: [{ name: "Sougata Chanda" }],
  openGraph: {
    title: "Sougata Chanda - Full-Stack Software Developer",
    description: "I build products, systems & experiences that scale. Specializing in Next.js, React, Node.js, Python & Cloud Infrastructure.",
    type: "website",
    locale: "en_US",
    siteName: "Sougata Chanda Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sougata Chanda - Full-Stack Software Developer",
    description: "I build products, systems & experiences that scale."
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sougata Chanda",
  "jobTitle": "Full-Stack Software Developer & Systems Architect",
  "url": "https://sougata.dev",
  "sameAs": [
    "https://github.com",
    "https://linkedin.com"
  ],
  "knowsAbout": [
    "TypeScript", "Next.js", "React", "Node.js", "Python", "Rust", "PostgreSQL", "AWS", "Docker", "System Architecture"
  ],
  "description": "Full-stack software engineer specializing in modern web applications, backend microservices, cloud infrastructure, and AI-powered products."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} dark scroll-smooth`}
    >
      <body className="bg-[#141313] text-[#e5e2e1] font-body antialiased min-h-screen flex flex-col selection:bg-[#D8FF45] selection:text-[#0A0A0A]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-grow relative">{children}</main>
      </body>
    </html>
  );
}
