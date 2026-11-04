"use client";

import { useEffect, useState } from "react";
import { decompressFromEncodedURIComponent } from "lz-string";
import GuideView from "@/components/GuideView";
import { Guide } from "@/lib/type";
import Link from "next/link";

function parseHash(): { guide: Guide | null; error: string | null } {
  if (typeof window === "undefined") {
    return { guide: null, error: null };
  }
  try {
    const hash = window.location.hash;
    const match = hash.match(/#g=([^&]+)/);
    if (!match) {
      return { guide: null, error: "No guide data found in URL." };
    }
    const compressed = match[1];
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) {
      return { guide: null, error: "Failed to decompress guide data." };
    }
    return { guide: JSON.parse(json), error: null };
  } catch {
    return { guide: null, error: "Invalid guide data." };
  }
}

export default function GeneratedPage() {
  const [state, setState] = useState<{
    guide: Guide | null;
    error: string | null;
  }>({ guide: null, error: null });

  useEffect(() => {
    setState(parseHash());
  }, []);

  if (state.error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{state.error}</p>
        <Link href="/" className="text-blue-600 underline">
          Back home
        </Link>
      </div>
    );
  }

  if (!state.guide) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p>Loading guide...</p>
      </div>
    );
  }

  return <GuideView guide={state.guide} />;
}
