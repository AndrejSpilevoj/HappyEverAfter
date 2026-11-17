import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matematika be streso | Andrius",
  description: "Nemokamos matematikos vaizdo pamokos 8 klasei ir individualios pamokos su Andriumi. Mokykis savo tempu.",
  metadataBase: new URL("https://matematikabestreso.lt"),
  openGraph: {
    type: "website",
    locale: "lt_LT",
    url: "https://matematikabestreso.lt/",
    siteName: "Matematika be streso",
    title: "Matematika be streso | Andrius",
    description: "Nemokamos matematikos vaizdo pamokos 8 klasei ir individualios pamokos su Andriumi.",
    images: [{
      url: "/social-preview-v1.png",
      width: 1200,
      height: 630,
      type: "image/png",
      alt: "Matematika be streso",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matematika be streso | Andrius",
    images: ["/social-preview-v1.png"],
  },
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
