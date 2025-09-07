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
  title: "Storybook Creator - Personalized Children's Stories",
  description:
    "Create magical, personalized storybooks for your child with AI-generated illustrations and narratives tailored to their interests and imagination.",
  keywords:
    "children's books, personalized stories, AI illustration, custom storybooks, kids reading",
  openGraph: {
    title: "Storybook Creator - Personalized Children's Stories",
    description:
      "Create magical, personalized storybooks for your child with AI-generated illustrations and narratives.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
