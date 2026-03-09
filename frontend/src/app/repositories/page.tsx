'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import { apiFetch } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { canManageRepositories } from '@/lib/guards';
import { formatDate } from '@/lib/utils';
import { Repository } from '@/types';

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [fullName, setFullName] = useState('facebook/react');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = authStorage.getUser();

  async function loadRepositories() {
    const data = await apiFetch<Repository[]>('/repositories');
    setRepositories(data);
  }

  useEffect(() => {
    loadRepositories().catch(console.error);
  }, []);

  async function handleAdd() {
    try {
      setLoading(true);
      setError('');

      await apiFetch('/repositories', {
        method: 'POST',
        body: JSON.stringify({ fullName }),
      });

      setFullName('');
      await loadRepositories();
    } catch (err: any) {
      setError(err.message || 'Failed to add repository');
    } finally {
      setLoading(false);
    }
  }

  async function handleSync(id: number) {
    try {
      setError('');
      await apiFetch(`/repositories/${id}/sync`, {
        method: 'POST',
      });
      await loadRepositories();
    } catch (err: any) {
      setError(err.message || 'Sync failed');
    }
  }

  return (
    <div>
      <Navbar />

      <div className="container-app space-y-6 py-8">
        <div>
          <h1 className="text-3xl font-bold">Repositories</h1>
          <p className="mt-2 text-slate-400">
            Track public GitHub repositories and sync their activity.
          </p>
        </div>

        {canManageRepositories(user) && (
          <Card>
            <div className="flex flex-col gap-3 md:flex-row">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="owner/repository"
              />
              <Button onClick={handleAdd} disabled={loading}>
                {loading ? 'Adding...' : 'Add repository'}
              </Button>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </Card>
        )}

        {!canManageRepositories(user) && (
          <Card>
            <p className="text-slate-400">
              Guest users can view repositories, but only Admin and Analyst can add or sync them.
            </p>
          </Card>
        )}

        {!repositories.length ? (
          <EmptyState
            title="No repositories tracked"
            description="Add a public GitHub repository to start collecting activity."
          />
        ) : (
          <div className="grid gap-4">
            {repositories.map((repo) => (
              <Card key={repo.id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{repo.fullName}</h2>
                    <p className="mt-1 text-slate-400">{repo.description || 'No description'}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>Owner: {repo.owner}</span>
                      <span>Activities: {repo._count?.activities || 0}</span>
                      <span>Last sync: {formatDate(repo.lastSyncedAt || null)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/repositories/${repo.id}`}>
                      <Button>Details</Button>
                    </Link>

                    {canManageRepositories(user) && (
                      <Button onClick={() => handleSync(repo.id)}>Sync</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}