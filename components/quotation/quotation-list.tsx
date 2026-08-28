"use client";

import { Search } from "lucide-react";
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
      <Card>
        <h2 className="font-semibold">Create Quotation</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Build a new quotation, download its PDF from the detail page, or convert it to an invoice after creation.</p>
        <Button asChild href="/app/quotations/new" className="mt-4">Create Quotation</Button>
      </Card>
      <Card>
        <h2 className="font-semibold">Open Quotation</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Quotation ID"><Input value={quotationId} onChange={(event) => setQuotationId(event.target.value)} placeholder="Enter ID" /></Field>
          <Button type="button" variant="secondary" onClick={openQuotation} disabled={!quotationId.trim()}><Search className="h-4 w-4" />Open</Button>
        </div>
      </Card>
    </div>
  );
}
