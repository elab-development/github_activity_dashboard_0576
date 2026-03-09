import Card from '../ui/Card';
import { AnalystRepoInsight } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AnalystInsightsPanel({
  data,
}: {
  data: AnalystRepoInsight[];
}) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Analyst repo insights</h2>
        <p className="mt-1 text-sm text-slate-400">
          Advanced GitHub GraphQL analytics for tracked repositories.
        </p>
      </div>

      {!data.length ? (
        <p className="text-slate-500">
          No tracked repositories available for analyst insights yet.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((repo) => (
            <div
              key={repo.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-lg font-semibold text-white">
                    {repo.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Language: {repo.primaryLanguage} • Default branch: {repo.defaultBranch}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last pushed: {formatDate(repo.pushedAt)} • Last synced:{' '}
                    {formatDate(repo.lastSyncedAt)}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[360px]">
                  <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-xs text-slate-400">Stars</div>
                    <div className="text-lg font-bold text-white">{repo.stars}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-xs text-slate-400">Forks</div>
                    <div className="text-lg font-bold text-white">{repo.forks}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-xs text-slate-400">Watchers</div>
                    <div className="text-lg font-bold text-white">{repo.watchers}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-xs text-slate-400">Open issues</div>
                    <div className="text-lg font-bold text-white">{repo.openIssues}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="text-xs text-slate-400">Open PRs</div>
                    <div className="text-lg font-bold text-white">{repo.openPullRequests}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}