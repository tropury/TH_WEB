import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const serifFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sansFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TreeHouse Studio — New Experience Rendering",
  description:
    "Estamos renderizando uma nova experiência. O novo site da TreeHouse Studio — arquitetura, design de interiores e visual persuasion — estará disponível em breve.",
  keywords: [
    "TreeHouse Studio",
    "3D Visualization",
    "CGI",
    "ArchViz",
    "Visual Persuasion",
    "Architecture",
    "Interior Design",
  ],
  authors: [{ name: "TreeHouse Studio" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "TreeHouse Studio — New Experience Rendering",
    description:
      "Estamos renderizando uma nova experiência. Nosso novo site estará disponível em breve.",
    siteName: "TreeHouse Studio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TreeHouse Studio — New Experience Rendering",
    description:
      "Estamos renderizando uma nova experiência. Nosso novo site estará disponível em breve.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${serifFont.variable} ${sansFont.variable} ${monoFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
