"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copy",
  testId,
}: {
  text: string;
  label?: string;
  testId?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("clipboard unavailable");
      }
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
      return;
    } catch {
      try {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.top = "0";
        area.style.left = "0";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.focus();
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw new Error("copy failed");
        setCopied(true);
        setFailed(false);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setFailed(true);
        setCopied(false);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      data-testid={testId}
      className={cn(
        buttonVariants({ size: "lg" }),
        "rounded-md bg-ink px-4 text-[#f4f7f8] hover:bg-[#1c2530]",
      )}
    >
      {copied ? "Copied" : failed ? "Copy failed — select the text" : label}
    </button>
  );
}
