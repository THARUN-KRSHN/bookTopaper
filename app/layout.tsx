import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/shared/AuthModal";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { AuthProvider } from "@/components/shared/AuthProvider";
import { Toast } from "@/components/shared/Toast";

const outfit = Outfit({
  variable: "--font-styrene",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sohne",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-berkeley",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookToPaper — Your notes. Your exam. Your pace.",
  description:
    "Upload study material and generate realistic exam papers, evaluate your answers, and build a personalised study plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-bg-base text-text-primary selection:bg-accent-primary/20">
        <AuthProvider>
          {children}
          <AuthModal />
          <CommandPalette />
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
