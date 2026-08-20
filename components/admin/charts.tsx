"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { MetricPoint } from "@/types";
import { Card } from "@/components/common/ui";

const chartColors = ["#007a78", "#f15a4a", "#2563eb", "#0f9f6e"];

export function RevenueChart({ data }: { data: MetricPoint[] }) {
  return (
    <Card className="min-h-80">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="text-base font-semibold text-foreground">Monthly Revenue</h2><p className="text-sm text-muted-foreground">Current and previous period</p></div>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Last 6 months</option><option>Year to date</option></select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
          <Area type="monotone" dataKey="previous" stroke="#94a3b8" fill="#94a3b822" strokeWidth={2} />
          <Area type="monotone" dataKey="value" stroke="#007a78" fill="#007a7826" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SimpleBarChart({ title, data }: { title: string; data: MetricPoint[] }) {
  return (
    <Card className="min-h-72">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
          <Bar dataKey="value" fill="#007a78" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SimpleLineChart({ title, data }: { title: string; data: MetricPoint[] }) {
  return (
    <Card className="min-h-72">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
          <Line dataKey="value" stroke="#f15a4a" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function UsagePieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card className="min-h-72">
      <h2 className="text-base font-semibold text-foreground">Usage By Plan</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={86} paddingAngle={3}>
            {data.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
