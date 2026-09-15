import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeitkastli",
  description:
    "Put something somewhere. Find it again — a map that remembers where your capsules are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
