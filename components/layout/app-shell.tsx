"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { mockUser } from "@/src/mocks/customer/data";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar plan={mockUser.plan} />
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-black/40" aria-label="Close navigation" onClick={() => setOpen(false)} type="button" />
            <motion.div className="relative h-full" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.2 }}>
              <Sidebar plan={mockUser.plan} onNavigate={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="min-w-0 lg:pl-72">
        <TopNavbar user={mockUser} onMenuClick={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
