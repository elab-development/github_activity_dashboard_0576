'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../ui/Card';

export default function RepoActivityBreakdownChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold text-white">Activity breakdown</h2>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}