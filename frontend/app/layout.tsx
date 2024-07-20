import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/appContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KeywordDetector",
  description:
    "KeywordDetector is your ultimate tool for uncovering the most frequently used tech keywords on any website. Whether you`re a digital marketer, SEO expert, content creator, or simply curious about what technologies are mentioned on website, KeywordDetector provides you with the insights you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {" "}
        <AppProvider>
          {" "}
          <Toaster />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
