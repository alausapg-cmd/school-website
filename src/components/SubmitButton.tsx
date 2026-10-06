"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "btn-primary", pendingText = "Saving…" }: { children: ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
