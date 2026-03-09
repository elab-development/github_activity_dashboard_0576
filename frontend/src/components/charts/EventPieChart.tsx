'use client';

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';

export default function EventPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold">Event type distribution</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110}>
              {data.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}