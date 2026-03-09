'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ContributorsBarChart from '@/components/charts/ContributorsBarChart';
import EventPieChart from '@/components/charts/EventPieChart';
import StatsCards from '@/components/charts/StatsCards';
import AnalystInsightsPanel from '@/components/charts/AnalystInsightsPanel';
import { apiFetch } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import {
  AnalystRepoInsight,
  Contributor,
  SummaryResponse,
} from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [analystInsights, setAnalystInsights] = useState<AnalystRepoInsight[]>([]);
  const user = authStorage.getUser();

  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    apiFetch<SummaryResponse>('/activity/stats/summary')
      .then(setSummary)
      .catch(() => router.push('/login'));

    apiFetch<Contributor[]>('/activity/stats/contributors')
      .then(setContributors)
      .catch(console.error);

    if (user?.role === 'ANALYST' || user?.role === 'ADMIN') {
      apiFetch<AnalystRepoInsight[]>('/activity/stats/analyst-overview')
        .then(setAnalystInsights)
        .catch(console.error);
    }
  }, [router, user?.role]);

  const pieData =
    summary?.groupedByType?.map((item) => ({
      name: item.type,
      value: item._count.type,
    })) || [];

  return (
    <div>
      <Navbar />

      <div className="container-app space-y-6 py-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Overview of GitHub repository activity and contributor stats.
          </p>
        </div>

        <StatsCards
          totalEvents={summary?.totalEvents || 0}
          totalRepositories={summary?.totalRepositories || 0}
          totalBranches={summary?.totalBranches || 0}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <EventPieChart data={pieData} />
          <ContributorsBarChart data={contributors} />
        </div>

        {(user?.role === 'ANALYST' || user?.role === 'ADMIN') && (
          <AnalystInsightsPanel data={analystInsights} />
        )}
      </div>
    </div>
  );
}