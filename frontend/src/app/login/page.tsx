'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { LoginResponse } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(emailValue: string, passwordValue: string) {
    try {
      setLoading(true);
      setError('');

      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      authStorage.setSession(data.accessToken, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="container-app flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="mt-2 text-slate-400">
              Sign in as admin, analyst or guest viewer.
            </p>
          </div>

          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="grid gap-2 md:grid-cols-2">
            <Button
              type="button"
              className="w-full"
              onClick={() => login('admin@example.com', 'admin123')}
            >
              Login as Admin
            </Button>

            <Button
              type="button"
              className="w-full"
              onClick={() => login('guest@example.com', 'guest123')}
            >
              Login as Guest
            </Button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
            <p>Admin: admin@example.com / admin123</p>
            <p>Guest: guest@example.com / guest123</p>
            <p>Analyst: analyst@example.com / guest123</p>
          </div>

          <p className="text-sm text-slate-400">
            No account? <Link href="/register" className="text-cyan-400">Register here</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}