'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ActivityTable from '@/components/activity/ActivityTable';
import RepoActivityBreakdownChart from '@/components/charts/RepoActivityBreakdownChart';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Repository } from '@/types';

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </Card>
  );
}

export default function RepositoryDetailsPage() {
  const params = useParams();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    apiFetch<Repository>(`/repositories/${params.id}`)
      .then((data) => setRepository(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params?.id]);

  const stats = useMemo(() => {
    const activities = repository?.activities || [];
    const branches = repository?.branches || [];

    const commits = activities.filter((item) => item.type === 'COMMIT').length;
    const issuesOpened = activities.filter((item) => item.type === 'ISSUE_OPENED').length;
    const issuesClosed = activities.filter((item) => item.type === 'ISSUE_CLOSED').length;
    const prsOpened = activities.filter((item) => item.type === 'PR_OPENED').length;
    const prsClosed = activities.filter((item) => item.type === 'PR_CLOSED').length;
    const branchEvents = activities.filter((item) => item.type === 'BRANCH').length;

    const contributorsMap = activities.reduce<Record<string, number>>((acc, item) => {
      acc[item.author] = (acc[item.author] || 0) + 1;
      return acc;
    }, {});

    const topContributorEntry = Object.entries(contributorsMap).sort((a, b) => b[1] - a[1])[0];

    return {
      totalActivities: activities.length,
      totalBranches: branches.length,
      commits,
      issuesOpened,
      issuesClosed,
      prsOpened,
      prsClosed,
      branchEvents,
      topContributor: topContributorEntry ? topContributorEntry[0] : 'N/A',
      topContributorCount: topContributorEntry ? topContributorEntry[1] : 0,
    };
  }, [repository]);

  const chartData = [
    { name: 'Commits', value: stats.commits },
    { name: 'Issues Open', value: stats.issuesOpened },
    { name: 'Issues Closed', value: stats.issuesClosed },
    { name: 'PR Open', value: stats.prsOpened },
    { name: 'PR Closed', value: stats.prsClosed },
    { name: 'Branches', value: stats.branchEvents },
  ];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container-app py-8">Loading repository...</div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div>
        <Navbar />
        <div className="container-app py-8">
          <EmptyState
            title="Repository not found"
            description="The selected repository could not be loaded."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container-app space-y-6 py-8">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-400">
                Repository Details
              </div>

              <h1 className="break-words text-3xl font-bold text-white">
                {repository.fullName}
              </h1>

              <p className="mt-3 break-words text-slate-300">
                {repository.description || 'No description available for this repository.'}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Owner: {repository.owner}</span>
                <span>Last sync: {formatDate(repository.lastSyncedAt || null)}</span>
              </div>

              <div className="mt-5">
                <Link
                  href={repository.url}
                  target="_blank"
                  className="inline-flex rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  Open on GitHub
                </Link>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[360px]">
              <StatCard label="Total activity" value={stats.totalActivities} />
              <StatCard label="Branches" value={stats.totalBranches} />
              <StatCard label="Commits" value={stats.commits} />
              <StatCard label="Issues + PRs" value={stats.issuesOpened + stats.issuesClosed + stats.prsOpened + stats.prsClosed} />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-white">Repository summary</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-sm text-slate-400">Top contributor</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {stats.topContributor}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {stats.topContributorCount} activity events
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-sm text-slate-400">Quick breakdown</div>
                <div className="mt-2 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Commits</span>
                    <span>{stats.commits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Opened issues</span>
                    <span>{stats.issuesOpened}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Closed issues</span>
                    <span>{stats.issuesClosed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Opened PRs</span>
                    <span>{stats.prsOpened}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Closed PRs</span>
                    <span>{stats.prsClosed}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-xl font-semibold text-white">Branches</h2>

            {repository.branches && repository.branches.length > 0 ? (
              <div className="flex max-h-[320px] flex-wrap gap-2 overflow-auto pr-1">
                {repository.branches.map((branch) => (
                  <span
                    key={branch.id}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-200"
                  >
                    {branch.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No branches loaded yet. Sync this repository first.</p>
            )}
          </Card>
        </div>

        <RepoActivityBreakdownChart data={chartData} />

        <div>
          <h2 className="mb-4 text-2xl font-semibold text-white">Recent activity</h2>

          {repository.activities && repository.activities.length > 0 ? (
            <ActivityTable data={repository.activities} />
          ) : (
            <EmptyState
              title="No activity yet"
              description="This repository has no synced activity yet. Click Sync on the repositories page."
            />
          )}
        </div>
      </div>
    </div>
  );
}