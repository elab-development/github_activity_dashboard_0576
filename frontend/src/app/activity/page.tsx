'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ActivityFilters from '@/components/activity/ActivityFilters';
import ActivityTable from '@/components/activity/ActivityTable';
import { useActivityFilters } from '@/hooks/useActivityFilters';
import { apiFetch } from '@/lib/api';
import { ActivityEvent } from '@/types';

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    apiFetch<ActivityEvent[]>('/activity/timeline')
      .then(setEvents)
      .catch(console.error);
  }, []);

  const { author, type, setAuthor, setType, clearFilters, filteredData } =
    useActivityFilters(events);

  return (
    <div>
      <Navbar />

      <div className="container-app space-y-6 py-8">
        <div>
          <h1 className="text-3xl font-bold">Activity Timeline</h1>
          <p className="mt-2 text-slate-400">
            Browse commits, issues, pull requests and branch events.
          </p>
        </div>

        <ActivityFilters
          author={author}
          type={type}
          onAuthorChange={setAuthor}
          onTypeChange={setType}
          onClear={clearFilters}
        />

        <ActivityTable data={filteredData} />
      </div>
    </div>
  );
}