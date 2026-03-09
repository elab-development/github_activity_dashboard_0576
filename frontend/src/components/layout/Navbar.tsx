'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authStorage } from '@/lib/auth';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/repositories', label: 'Repositories' },
  { href: '/activity', label: 'Activity' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = authStorage.getUser();

  function logout() {
    authStorage.clear();
    router.push('/login');
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="container-app flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            GitHub Activity Dashboard
          </Link>
          {user && <Badge text={user.role} />}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'text-cyan-400' : 'text-slate-300'}
            >
              {link.label}
            </Link>
          ))}

          {user && <span className="text-sm text-slate-400">{user.fullName}</span>}

          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    </nav>
  );
}