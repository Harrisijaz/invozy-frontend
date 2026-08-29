"use client";

import type { PaddleEventData } from "@paddle/paddle-js";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useSubscription } from "@/src/hooks/customer/useSubscription";

const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const paddleEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production" ? "production" : "sandbox";

export default function PayPage() {
  const [ready, setReady] = useState(false);
  const subscription = useSubscription();

  useEffect(() => {
    if (!ready || !window.Paddle || !paddleToken) return;
    window.Paddle.Environment.set(paddleEnvironment);
    window.Paddle.Initialize({
      token: paddleToken,
      eventCallback: (event: PaddleEventData) => {
        if (event.name?.includes("checkout")) {
          void subscription.refetch();
        }
      },
    });
  }, [ready, subscription]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <section className="w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Complete Payment</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Preparing your secure checkout. This page will continue automatically when payment is ready.</p>
        {!paddleToken ? <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-error">Payment setup is unavailable.</p> : null}
      </section>
    </main>
  );
}
