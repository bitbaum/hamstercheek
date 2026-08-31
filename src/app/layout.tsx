import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HamsterCheek",
  description: "Store and find your valuables, off the grid.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
