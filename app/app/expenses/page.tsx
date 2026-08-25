"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FeatureGate } from "@/components/shared/feature-gate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { mockExpenses, mockUsage, mockUser } from "@/src/mocks/customer/data";
import { getEntitlements } from "@/src/lib/customer/entitlements";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";

export default function ExpensesPage() {
  const [adding, setAdding] = useState(false);
  const entitlements = getEntitlements(mockUser.plan, mockUsage);
  return (
    <div className="grid gap-6">
      <PageHeader title="Expenses" description="Track business expenses with monthly limits for Free users." actions={<Button onClick={() => setAdding((value) => !value)} disabled={!entitlements.canTrackExpenses}>Add Expense</Button>} />
      {!entitlements.canTrackExpenses ? <FeatureGate allowed={false} title="Monthly expense limit reached" description="You've reached your monthly expense limit. Upgrade to Paid for unlimited expenses."><span /></FeatureGate> : null}
      {adding ? (
        <Card className="grid gap-4">
          <h2 className="font-semibold">Add Expense</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Amount"><Input type="number" min="0" step="0.01" /></Field>
            <Field label="Category"><Select><option>Software</option><option>Travel</option><option>Marketing</option></Select></Field>
            <Field label="Date"><Input type="date" defaultValue="2026-08-25" /></Field>
            <Field label="Note"><Input placeholder="Short note" /></Field>
          </div>
          <div className="flex justify-end"><Button>Save Expense</Button></div>
        </Card>
      ) : null}
      <Card className="min-w-0">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="py-3 pr-3">Date</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Note</th><th className="py-3 pl-3 text-right">Amount</th></tr></thead>
            <tbody>{mockExpenses.map((expense) => <tr key={expense.id} className="border-b border-border last:border-0"><td className="py-4 pr-3">{formatDate(expense.date)}</td><td className="px-3 py-4">{expense.category}</td><td className="px-3 py-4 text-muted-foreground">{expense.note}</td><td className="py-4 pl-3 text-right font-medium">{formatCurrency(expense.amount, expense.currency)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="grid gap-3 md:hidden">{mockExpenses.map((expense) => <div key={expense.id} className="rounded-lg border border-border p-4"><div className="flex justify-between gap-3"><div><p className="font-medium">{expense.category}</p><p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p></div><span className="font-semibold">{formatCurrency(expense.amount, expense.currency)}</span></div><p className="mt-3 text-sm text-muted-foreground">{expense.note}</p></div>)}</div>
      </Card>
    </div>
  );
}
