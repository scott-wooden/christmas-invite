import type { Metadata } from "next";
import { event } from "@/config/event";
import "./globals.css";

export const metadata: Metadata = {
  title: `${event.title} · You're invited`,
  description:
    "A little Christmas magic, good company, and a night to remember. View the invitation and RSVP.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
