export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export type ActivityEvent = {
  id: number;
  type: string;
  title: string;
  description?: string | null;
  author: string;
  authorAvatar?: string | null;
  occurredAt: string;
  repository?: {
    id: number;
    fullName: string;
  };
};

export type Repository = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  description?: string | null;
  lastSyncedAt?: string | null;
  branches?: {
    id: number;
    name: string;
  }[];
  activities?: ActivityEvent[];
  _count?: {
    activities: number;
  };
};

export type SummaryResponse = {
  totalEvents: number;
  totalRepositories: number;
  totalBranches: number;
  groupedByType: {
    type: string;
    _count: {
      type: number;
    };
  }[];
};

export type Contributor = {
  author: string;
  count: number;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type AnalystRepoInsight = {
  id: number;
  fullName: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  openPullRequests: number;
  defaultBranch: string;
  primaryLanguage: string;
  pushedAt: string | null;
  lastSyncedAt: string | null;
};