"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/common/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function StatCard({ label, value, change, comparison, icon: Icon, currency = false }: { label: string; value: number; change?: number; comparison?: string; icon: LucideIcon; currency?: boolean }) {
  const positive = (change ?? 0) >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{currency ? formatCurrency(value) : formatNumber(value)}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-5 w-5" /></div>
        </div>
        {change !== undefined ? (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={positive ? "inline-flex items-center gap-1 text-success" : "inline-flex items-center gap-1 text-error"}>{positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}{Math.abs(change)}%</span>
            <span className="text-muted-foreground">{comparison}</span>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
