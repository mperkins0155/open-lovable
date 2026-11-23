"use client";

import { Analytics, type BeforeSend } from "@vercel/analytics/next";

/**
 * Strips query + fragment from every analytics URL: /generation?url=...&details=...
 * carries user-typed URLs and text that must not be sent to Vercel.
 * Custom events are dropped (returning an object without `payload` makes the
 * script reuse the original payload). Unparseable URLs are dropped.
 */
export const analyticsBeforeSend: BeforeSend = (event) => {
  if (event.type === "event") return null;
  let parsed: URL;
  try {
    parsed = new URL(event.url, "http://placeholder.invalid");
  } catch {
    return null;
  }
  parsed.search = "";
  parsed.hash = "";
  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(event.url);
  return { ...event, url: isAbsolute ? parsed.toString() : parsed.pathname };
};

export default function VercelAnalytics() {
  return <Analytics beforeSend={analyticsBeforeSend} />;
}
