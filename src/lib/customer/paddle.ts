"use client";

import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined;

function paddleEnvironment(): Environments {
  return process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production" ? "production" : "sandbox";
}

function appOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

type CheckoutKind = "invoice" | "subscription";

function paddleSuccessUrl(kind: CheckoutKind) {
  return `${appOrigin()}/billing/success?type=${kind}`;
}

export async function getPaddle() {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error("Paddle client-side token is missing.");
  }

  paddleInstance ??= await initializePaddle({
    environment: paddleEnvironment(),
    token,
    checkout: {
      settings: {
        displayMode: "overlay",
        theme: "light",
        successUrl: paddleSuccessUrl("subscription"),
      },
    },
  });

  if (!paddleInstance) {
    throw new Error("Unable to initialize Paddle checkout.");
  }

  return paddleInstance;
}

export async function openPaddleCheckout(transactionId: string, kind: CheckoutKind = "subscription") {
  if (!transactionId) {
    throw new Error("Backend did not return Paddle transactionId");
  }

  const paddle = await getPaddle();
  paddle.Checkout.open({
    transactionId,
    settings: {
      displayMode: "overlay",
      theme: "light",
      successUrl: paddleSuccessUrl(kind),
    },
  });
}
