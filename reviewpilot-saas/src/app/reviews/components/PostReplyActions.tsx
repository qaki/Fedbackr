"use client";
import { useState } from "react";

export default function PostReplyActions({ reviewId, initialDraft }: { reviewId: string; initialDraft: string }) {
  const [draft, setDraft] = useState(initialDraft || "");
  const [posting, setPosting] = useState(false);

  const post = async () => {
    if (!draft) return;
    setPosting(true);
    
    try {
      const res = await fetch("/api/google/reviews/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, replyText: draft }),
      });
      const data = await res.json();
      
      if (data.posted) {
        // reload list
        window.dispatchEvent(new CustomEvent("reviews:reload"));
        return;
      }

      // Fallback: show prompt to copy/open/mark
      const go = confirm("Could not post automatically.\n\nClick OK to copy the reply, then you will be redirected to Google Reviews to paste it. After posting, come back and click OK to mark as posted.");
      if (go) {
        try { 
          await navigator.clipboard.writeText(draft); 
        } catch (e) {
          console.error("Failed to copy to clipboard:", e);
        }
        if (data.fallbackUrl) window.open(data.fallbackUrl, "_blank", "noopener,noreferrer");
        
        // After user returns, mark as posted
        const ok = confirm("Did you successfully post the reply on Google?");
        if (ok) {
          await fetch("/api/google/reviews/mark-posted", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewId, text: draft }),
          });
          window.dispatchEvent(new CustomEvent("reviews:reload"));
        }
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-2 flex gap-2">
      <textarea
        className="w-full rounded-md border bg-transparent p-2 h-24 text-white placeholder-gray-400"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Your reply draft…"
      />
      <button
        onClick={post}
        disabled={!draft || posting}
        className="shrink-0 rounded-xl bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-60 hover:bg-blue-700 transition-colors"
      >
        {posting ? "Posting…" : "Post Reply"}
      </button>
    </div>
  );
}
