"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-card-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
  danger: "bg-error text-white hover:bg-error/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-11 px-5 text-base",
  icon: "h-11 w-11 p-0",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
  children: ReactNode;
};

type Props = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(function Button(
  { className, variant = "primary", size = "md", isLoading, disabled, asChild, href, children, ...props },
  ref,
) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild && href) {
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...props}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});
