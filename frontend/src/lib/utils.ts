export function formatDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function roleColor(role?: string) {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'ANALYST':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    default:
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  }
}