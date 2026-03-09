import Card from '../ui/Card';

export default function StatsCards({
  totalEvents,
  totalRepositories,
  totalBranches,
}: {
  totalEvents: number;
  totalRepositories: number;
  totalBranches: number;
}) {
  const items = [
    { label: 'Total events', value: totalEvents },
    { label: 'Tracked repositories', value: totalRepositories },
    { label: 'Branches', value: totalBranches },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="text-sm text-slate-400">{item.label}</div>
          <div className="mt-2 text-3xl font-bold">{item.value}</div>
        </Card>
      ))}
    </div>
  );
}