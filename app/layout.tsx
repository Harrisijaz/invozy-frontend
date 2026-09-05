import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invorights.com";
const title = "InvoRights";
const description = "Invoice, quotation, expense, and financial management software for modern businesses.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "InvoRights",
  title: {
    default: title,
    template: "%s | InvoRights",
  },
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand/invorights-mark.png",
    shortcut: "/brand/invorights-mark.png",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "InvoRights",
    images: [
      {
        url: "/brand/invorights-logo.png",
        width: 1315,
        height: 285,
        alt: "InvoRights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/brand/invorights-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
