"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ open, title, description, confirmLabel, destructive = false, loading, onCancel, onConfirm }: { open: boolean; title: string; description: string; confirmLabel: string; destructive?: boolean; loading?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
          <motion.div className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-xl" initial={{ scale: 0.97, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 8 }}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button variant={destructive ? "danger" : "primary"} isLoading={loading} onClick={onConfirm}>{confirmLabel}</Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
