"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { incomeExpenseSeries, invoiceStatusSeries } from "@/src/mocks/customer/data";

const colors = ["var(--primary)", "var(--accent)", "var(--warning)", "var(--muted-foreground)"];

export function IncomeExpenseChart() {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Monthly cash movement from paid invoices and expenses.</CardDescription>
      </CardHeader>
      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={incomeExpenseSeries} margin={{ left: -20, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="income" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--accent)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function InvoiceStatusChart() {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>Current document mix by status.</CardDescription>
      </CardHeader>
      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={invoiceStatusSeries} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88} paddingAngle={3}>
              {invoiceStatusSeries.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
