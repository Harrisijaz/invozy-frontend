import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Providers } from "./providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invorights.com";
const title = "SmartInvoice";
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
  applicationName: "SmartInvoice",
  title: {
    default: title,
    template: "%s | InvoRights",
  },
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/brand/invorights-mark.png",
    shortcut: "/brand/invorights-mark.png",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "SmartInvoice",
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
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
