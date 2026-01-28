import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "词汇流 AI 2.0",
  description: "面向未来的英语学习工作空间",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Dynamic grid background */}
        <div className="fixed inset-0 grid-bg pointer-events-none" />

        {/* Main content area */}
        <main className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="container mx-auto px-6 sm:px-8 py-12 max-w-7xl">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
