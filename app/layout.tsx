import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastProvider } from "@/components/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Platform v2",
  description: "Gestión de códigos QR - renovacionfemenina.org",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased light`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          {children}
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
