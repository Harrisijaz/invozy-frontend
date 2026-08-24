import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the secure Invozy administration portal.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
