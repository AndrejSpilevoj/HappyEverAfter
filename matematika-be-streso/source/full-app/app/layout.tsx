import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matematika be streso | Andrius",
  description: "Nemokamos matematikos vaizdo pamokos 8 klasei ir individualios pamokos su Andriumi. Mokykis savo tempu.",
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
    <html lang="lt">
      <body className="antialiased">{children}</body>
    </html>
  );
}
