import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club XR — Browser VR Arcade",
  description: "Pick a WebXR world and jump in. Curated by the Software Engineering Club.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
