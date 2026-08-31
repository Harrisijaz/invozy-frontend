"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/common/toast";
import { useCreateExpense } from "@/src/hooks/customer/useExpenses";
import { amountToCents, centsToAmount } from "@/src/lib/customer/normalize";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { financialService } from "@/src/services/customer/financial.service";

export default function ExpensesPage() {
  const toast = useToast();
  const createExpense = useCreateExpense();
  const summary = useQuery({ queryKey: ["customer", "finance-summary"], queryFn: () => financialService.summary() });
  const [adding, setAdding] = useState(true);
  const [form, setForm] = useState({ amount: "", category: "Software", expenseDate: "", note: "" });

  const save = async () => {
    try {
      await createExpense.mutateAsync({
        amountCents: amountToCents(Number(form.amount)),
        category: form.category,
        expenseDate: form.expenseDate,
        note: form.note,
      });
      toast("Expense saved.", "success");
      setAdding(false);
      setForm({ amount: "", category: "Software", expenseDate: "", note: "" });
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeader title="Expenses" description="Add expenses and review finance totals." actions={<Button className="w-full sm:w-auto" onClick={() => setAdding((value) => !value)}>{adding ? "Hide Form" : "Add Expense"}</Button>} />
      {adding ? (
        <Card className="grid gap-4 hover:border-primary/35 hover:shadow-md">
          <h2 className="font-semibold">Add Expense</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Amount"><Input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} /></Field>
            <Field label="Category"><Select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}><option>Software</option><option>Travel</option><option>Marketing</option><option>Office</option></Select></Field>
            <Field label="Date"><Input type="date" value={form.expenseDate} onChange={(event) => setForm((current) => ({ ...current, expenseDate: event.target.value }))} /></Field>
            <Field label="Note"><Input placeholder="Short note" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} /></Field>
          </div>
          <div className="flex justify-end"><Button className="w-full sm:w-auto" onClick={save} isLoading={createExpense.isPending}>Save Expense</Button></div>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
          <p className="text-sm text-muted-foreground">Income</p>
          <p className="mt-2 text-2xl font-semibold">{summary.data ? formatCurrency(centsToAmount(summary.data.incomeCents)) : "--"}</p>
        </Card>
        <Card className="hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
          <p className="text-sm text-muted-foreground">Expenses</p>
          <p className="mt-2 text-2xl font-semibold">{summary.data ? formatCurrency(centsToAmount(summary.data.expensesCents)) : "--"}</p>
        </Card>
        <Card className="hover:-translate-y-1 hover:border-primary/35 hover:shadow-md">
          <p className="text-sm text-muted-foreground">Savings</p>
          <p className="mt-2 text-2xl font-semibold">{summary.data ? formatCurrency(centsToAmount(summary.data.savingsCents)) : "--"}</p>
        </Card>
      </div>
      {summary.data ? <Card className="hover:border-primary/35 hover:shadow-md"><p className="text-sm text-muted-foreground">Summary period</p><p className="mt-2 font-medium">{formatDate(summary.data.fromDate)} - {formatDate(summary.data.toDate)}</p></Card> : null}
    </div>
  );
}
