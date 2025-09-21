import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin");

  // Get user's role
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id as string },
    select: { role: true },
  });

  const userRole = membership?.role || "viewer";

  return (
    <main className="max-w-5xl mx-auto py-12 px-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        {userRole !== "viewer" && (
          <form action="/api/reviews/sync" method="POST">
            <button className="rounded-xl bg-slate-700 px-3 py-2 text-sm">Sync now</button>
          </form>
        )}
      </header>
      <ReviewsClient userRole={userRole} />
    </main>
  );
}


