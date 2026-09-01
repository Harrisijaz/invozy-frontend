"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/src/lib/customer/formatters";
import { centsToAmount } from "@/src/lib/customer/normalize";
import type { FinanceSummary } from "@/src/types/customer";

const summaryColors = {
  income: "var(--success)",
  expenses: "var(--error)",
  savings: "var(--primary)",
};

function summaryChartData(summary: FinanceSummary) {
  return [
    { label: "Income", value: centsToAmount(summary.incomeCents), fill: summaryColors.income },
    { label: "Expenses", value: centsToAmount(summary.expensesCents), fill: summaryColors.expenses },
    { label: "Savings", value: centsToAmount(summary.savingsCents), fill: summaryColors.savings },
  ];
}

function tooltipFormatter(value: unknown) {
  const amount = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  return formatCurrency(amount);
}

export function FinancialSummaryChart({ summary, title = "Financial Performance" }: { summary: FinanceSummary; title?: string }) {
  const data = summaryChartData(summary);
  const trendData = [
    { label: "Income", income: data[0].value, expenses: 0, savings: 0 },
    { label: "Expenses", income: data[0].value, expenses: data[1].value, savings: 0 },
    { label: "Savings", income: data[0].value, expenses: data[1].value, savings: data[2].value },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{formatDate(summary.fromDate)} - {formatDate(summary.toDate)}</CardDescription>
        </CardHeader>
        <div className="h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value).toLocaleString()}`} width={78} />
              <Tooltip cursor={{ fill: "var(--muted)" }} formatter={tooltipFormatter} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry) => <Cell key={entry.label} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Income Health</CardTitle>
          <CardDescription>Income retained after expenses.</CardDescription>
        </CardHeader>
        <div className="h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 12, right: 12, bottom: 8, left: -12 }}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="income" stroke="var(--success)" fill="url(#incomeFill)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="savings" stroke="var(--primary)" fill="url(#savingsFill)" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function FinancialBreakdownChart({ summary }: { summary: FinanceSummary }) {
  const data = summaryChartData(summary);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Financial Breakdown</CardTitle>
        <CardDescription>Share of income, expenses, and savings for the selected period.</CardDescription>
      </CardHeader>
      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={64} outerRadius={96} paddingAngle={3}>
              {data.map((entry) => <Cell key={entry.label} fill={entry.fill} />)}
            </Pie>
            <Tooltip formatter={tooltipFormatter} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
