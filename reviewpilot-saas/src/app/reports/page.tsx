import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin");

  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">
            Track your review performance and export data for analysis.
          </p>
        </div>
        <ReportsClient />
      </div>
    </main>
  );
}
