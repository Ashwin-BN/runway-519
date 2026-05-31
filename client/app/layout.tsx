import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Runway Inventory - Fashion Retail Management",
  description: "Professional inventory management system for fashion retail operations. Track items, manage users, and streamline your runway operations.",
  keywords: ["inventory", "fashion", "retail", "runway", "management"],
  authors: [{ name: "Runway Inventory Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Runway Inventory Management",
    description: "Professional inventory management for fashion retail",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Runway Inventory" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded bg-blue-600 text-white px-3 py-2">Skip to content</a>
        <div className="min-h-screen flex flex-col">
          <main id="main" className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
