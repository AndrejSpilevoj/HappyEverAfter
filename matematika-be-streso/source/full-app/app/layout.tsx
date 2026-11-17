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
      <head>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="lt_LT" />
        <meta property="og:url" content="https://matematikabestreso.lt/" />
        <meta property="og:site_name" content="Matematika be streso" />
        <meta property="og:title" content="Matematika be streso | Andrius" />
        <meta property="og:description" content="Nemokamos matematikos vaizdo pamokos 8 klasei ir individualios pamokos su Andriumi." />
        <meta property="og:image" content="https://matematikabestreso.lt/social-preview-v1.png" />
        <meta property="og:image:secure_url" content="https://matematikabestreso.lt/social-preview-v1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Matematika be streso" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://matematikabestreso.lt/social-preview-v1.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
