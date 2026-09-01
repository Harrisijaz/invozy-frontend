export function normalizeLocalPaymentLinkUrl(url: string) {
  if (typeof window === "undefined") return url;

  try {
    const paymentUrl = new URL(url, window.location.origin);
    const isLocalPaymentLink = paymentUrl.hostname === "localhost" || paymentUrl.hostname === "127.0.0.1";

    if (isLocalPaymentLink && window.location.protocol === "http:" && paymentUrl.protocol === "https:") {
      paymentUrl.protocol = "http:";
    }

    return paymentUrl.toString();
  } catch {
    return url;
  }
}
