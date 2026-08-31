"use client";

import { ArrowRight, FilePlus2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";

export function QuotationList() {
  const router = useRouter();
  const [quotationId, setQuotationId] = useState("");

  const openQuotation = () => {
    const id = quotationId.trim();
    if (id) router.push(`/app/quotations/${id}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="group hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary transition duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
          <FilePlus2 className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-semibold">Create Quotation</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Build a new quotation, download its PDF from the detail page, or convert it to an invoice after creation.</p>
        <Button asChild href="/app/quotations/new" className="group mt-4 w-full sm:w-auto">Create Quotation <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" /></Button>
      </Card>
      <Card className="hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
        <h2 className="font-semibold">Open Quotation</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Quotation ID"><Input value={quotationId} onChange={(event) => setQuotationId(event.target.value)} placeholder="Enter ID" /></Field>
          <Button type="button" variant="secondary" className="w-full" onClick={openQuotation} disabled={!quotationId.trim()}><Search className="h-4 w-4" />Open</Button>
        </div>
      </Card>
    </div>
  );
}
