import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TreeHouse Studio",
  description: "We blend design, storytelling, and technology to create visuals that resonate and inspire. Architecture, interior design, and visual persuasion.",
  keywords: ["TreeHouse", "Visual Persuasion", "Architecture", "Interior Design", "Art", "Design", "Creative", "Portfolio"],
  authors: [{ name: "TreeHouse" }],
  icons: {
  icon: "/favicon.png",
  apple: "/favicon.png",
},
  openGraph: {
    title: "TreeHouse Studio",
    description: "We blend design, storytelling, and technology to create visuals that resonate and inspire.",
    url: "https://www.treehousestudio.com.br/",
    siteName: "TreeHouse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TreeHouse Studio",
    description: "We blend design, storytelling, and technology to create visuals that resonate and inspire.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
