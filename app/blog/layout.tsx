import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return <MarketingShell>{children}</MarketingShell>;
}
