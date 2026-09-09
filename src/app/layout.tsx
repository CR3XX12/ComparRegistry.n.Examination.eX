import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trademark Similarity Analyzer",
  description: "Prototype for ranking mock trademark records by similarity."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
