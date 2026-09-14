import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function BillingLayout({ children }: LayoutProps<"/billing">) {
  return children;
}
