"use client";

import { useEffect } from "react";
import { wakeApiBackend } from "@/lib/wakeApi";

/**
 * Fires as soon as any page loads. On Render free tier the first fetch
 * starts the backend container; login retries handle the remaining delay.
 */
export default function ApiWarmup() {
  useEffect(() => {
    wakeApiBackend();
  }, []);

  return null;
}
