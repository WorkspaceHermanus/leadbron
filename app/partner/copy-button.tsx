"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 rounded-md border border-moss/30 px-3 py-2 font-mono text-xs text-moss hover:border-brass hover:text-brass"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
