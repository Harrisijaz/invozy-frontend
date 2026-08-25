import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";

export const metadata: Metadata = { title: "Contact", description: "Contact Invozy." };

export default function ContactPage() {
  return <MarketingShell><section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact Invozy</h1><p className="mt-4 text-base leading-7 text-muted-foreground">Send a product or billing question to the Invozy team.</p><Card className="mt-8 grid gap-4"><Field label="Name"><Input /></Field><Field label="Email"><Input type="email" /></Field><Field label="Message"><Textarea /></Field><div className="flex justify-end"><Button>Send Message</Button></div></Card></section></MarketingShell>;
}
