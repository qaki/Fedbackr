"use client";
import { useState, useEffect } from "react";
import PostReplyActions from "./PostReplyActions";

interface ReviewCardProps {
  item: any;
  onPosted: () => void;
  userRole: string;
}

export default function ReviewCard({ item, onPosted, userRole }: ReviewCardProps) {
  const [draft, setDraft] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  // Load existing draft from replies if available
  useEffect(() => {
    const existingReply = item.replies?.find((r: any) => r.state === "draft");
    if (existingReply?.draft) {
      setDraft(existingReply.draft);
    }
  }, [item.replies]);

  const generate = async () => {
    setGenLoading(true);
    try {
      const res = await fetch("/api/reviews/reply/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: item.text || item.content,
          rating: item.rating,
          businessName: "Your Business",
          tone: item.rating <= 3 ? "empathetic and solution-focused" : "warm and appreciative",
        }),
      });
      const data = await res.json();
      setDraft(data.draft || "");
    } finally {
      setGenLoading(false);
    }
  };

  // Check if review has been replied to
  const hasReplied = item.replies?.some((r: any) => r.state === "posted");
  const statusBadge = hasReplied ? "Replied ✓" : "New";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium text-white">{item.authorName || "Customer"}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-yellow-400">{item.rating ? "★".repeat(item.rating) : ""}</div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            hasReplied 
              ? "bg-green-500/20 text-green-400" 
              : "bg-blue-500/20 text-blue-400"
          }`}>
            {statusBadge}
          </span>
        </div>
      </div>
      <div className="mt-2 text-slate-300 whitespace-pre-wrap">{item.text || item.content || ""}</div>
      <div className="mt-2 text-xs text-slate-400">{new Date(item.postedAt || item.createdAt).toLocaleString()}</div>

          {!hasReplied && (
            <div className="mt-4 space-y-2">
              {userRole === "viewer" ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400 text-sm font-medium">Read-Only Access</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    You have viewer permissions and cannot reply to reviews. Contact your organization owner to upgrade your permissions.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <button 
                      onClick={generate} 
                      disabled={genLoading} 
                      className="rounded-xl bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 transition-colors disabled:opacity-60"
                    >
                      {genLoading ? "Generating…" : "Generate AI Reply"}
                    </button>
                  </div>
                  <PostReplyActions reviewId={item.id} initialDraft={draft} />
                </>
              )}
            </div>
          )}

      {hasReplied && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-green-400 text-sm font-medium">Reply Posted</div>
          <div className="text-slate-300 text-sm mt-1">
            {item.replies?.find((r: any) => r.state === "posted")?.posted}
          </div>
        </div>
      )}
    </div>
  );
}


