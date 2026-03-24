import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phương Nam & Phạm Yến Wedding",
  description: "Trân trọng kính mời quý khách dự Lễ Thành Hôn — Thứ Bảy, ngày 11 tháng 04 năm 2026.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Phương Nam & Phạm Yến Wedding",
    description: "Lễ Thành Hôn — 11.04.2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
