"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./components/ReviewCard";

interface ReviewsClientProps {
  userRole: string;
}

export default function ReviewsClient({ userRole }: ReviewsClientProps) {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all"|"new"|"unreplied"|"negative">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews/list?filter=${filter}&take=50`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => { 
    load(); 
    
    // Listen for reload events from PostReplyActions
    const handleReload = () => load();
    window.addEventListener("reviews:reload", handleReload);
    
    return () => window.removeEventListener("reviews:reload", handleReload);
  }, [filter]);

  return (
    <section>
      <div className="mb-4 flex gap-2">
        {(["all","new","unreplied","negative"] as const).map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-3 py-1 text-sm transition-colors ${
              filter===f 
                ? "bg-blue-600 text-white" 
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}>
            {f[0].toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-slate-400">No reviews to show.</div>
      ) : (
            <div className="grid gap-3">
              {items.map((it) => (
                <ReviewCard key={it.id} item={it} onPosted={load} userRole={userRole} />
              ))}
            </div>
      )}
    </section>
  );
}


