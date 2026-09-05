import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request an admin password reset for the InvoRights administration portal.",
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
