import { ActivityEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';

function eventBadgeClasses(type: string) {
  switch (type) {
    case 'COMMIT':
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    case 'ISSUE_OPENED':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'ISSUE_CLOSED':
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    case 'PR_OPENED':
      return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
    case 'PR_CLOSED':
      return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
    case 'BRANCH':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    default:
      return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
}

export default function ActivityTable({ data }: { data: ActivityEvent[] }) {
  if (!data.length) {
    return (
      <EmptyState
        title="No activity found"
        description="Try syncing a repository or changing your filters."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Card key={item.id} className="max-w-full overflow-hidden">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${eventBadgeClasses(
                    item.type,
                  )}`}
                >
                  {item.type.replace('_', ' ')}
                </span>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  {item.authorAvatar ? (
                    <img
                      src={item.authorAvatar}
                      alt={item.author}
                      className="h-7 w-7 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs text-slate-300">
                      {item.author?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span>{item.author}</span>
                </div>
              </div>

              <h3 className="break-words text-lg font-semibold text-white">{item.title}</h3>

              <p className="mt-1 text-sm text-slate-400">
                {item.repository?.fullName || 'Unknown repository'}
              </p>

              {item.description && (
                <p className="mt-3 break-words whitespace-pre-wrap text-sm text-slate-300">
                  {item.description.length > 500
                    ? `${item.description.slice(0, 500)}...`
                    : item.description}
                </p>
              )}
            </div>

            <div className="shrink-0 text-sm text-slate-500">{formatDate(item.occurredAt)}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}