import { ForbiddenException, Injectable } from '@nestjs/common';
import { graphql } from '@octokit/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityQueryDto } from './dto/activity-query.dto';

@Injectable()
export class ActivityService {
  private readonly graphqlWithAuth: typeof graphql;

  constructor(private readonly prisma: PrismaService) {
    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN || ''}`,
      },
    });
  }

  async findAll(query: ActivityQueryDto, userId: number, role: string) {
    return this.prisma.activityEvent.findMany({
      where: {
        ...(query.type ? { type: query.type as any } : {}),
        ...(query.author
          ? {
              author: {
                contains: query.author,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(query.repositoryId ? { repositoryId: Number(query.repositoryId) } : {}),
        repository: role === 'ADMIN' ? {} : { userId },
      },
      include: {
        repository: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        occurredAt: 'desc',
      },
    });
  }

  async timeline(userId: number, role: string) {
    return this.prisma.activityEvent.findMany({
      where: {
        repository: role === 'ADMIN' ? {} : { userId },
      },
      include: {
        repository: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        occurredAt: 'desc',
      },
      take: 100,
    });
  }

  async summary(userId: number, role: string) {
    const repoWhere = role === 'ADMIN' ? {} : { userId };

    const repositories = await this.prisma.repository.findMany({
      where: repoWhere,
      select: { id: true },
    });

    const repositoryIds = repositories.map((repo) => repo.id);
    const safeIds = repositoryIds.length ? repositoryIds : [-1];

    const [totalEvents, totalRepositories, totalBranches] = await Promise.all([
      this.prisma.activityEvent.count({
        where: {
          repositoryId: { in: safeIds },
        },
      }),
      this.prisma.repository.count({
        where: repoWhere,
      }),
      this.prisma.branch.count({
        where: {
          repositoryId: { in: safeIds },
        },
      }),
    ]);

    const groupedByType = await this.prisma.activityEvent.groupBy({
      by: ['type'],
      where: {
        repositoryId: { in: safeIds },
      },
      _count: {
        type: true,
      },
    });

    return {
      totalEvents,
      totalRepositories,
      totalBranches,
      groupedByType,
    };
  }

  async topContributors(userId: number, role: string) {
    const repositories = await this.prisma.repository.findMany({
      where: role === 'ADMIN' ? {} : { userId },
      select: { id: true },
    });

    const repositoryIds = repositories.map((repo) => repo.id);
    const safeIds = repositoryIds.length ? repositoryIds : [-1];

    const grouped = await this.prisma.activityEvent.groupBy({
      by: ['author'],
      where: {
        repositoryId: { in: safeIds },
      },
      _count: {
        author: true,
      },
      orderBy: {
        _count: {
          author: 'desc',
        },
      },
      take: 10,
    });

    return grouped.map((item) => ({
      author: item.author,
      count: item._count.author,
    }));
  }

  async analystOverview(userId: number, role: string) {
    if (role !== 'ANALYST' && role !== 'ADMIN') {
      throw new ForbiddenException('Only analysts and admins can access analyst insights.');
    }

    if (!process.env.GITHUB_TOKEN) {
      throw new ForbiddenException(
        'GITHUB_TOKEN is missing. Add it in backend/.env to use GraphQL analyst insights.',
      );
    }

    const repositories = await this.prisma.repository.findMany({
      where: role === 'ADMIN' ? {} : { userId },
      select: {
        id: true,
        fullName: true,
        owner: true,
        name: true,
        lastSyncedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    const results = await Promise.all(
      repositories.map(async (repo) => {
        const [owner, name] = repo.fullName.split('/');

        try {
          const data: any = await this.graphqlWithAuth(
            `
              query RepoAnalytics($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                  stargazerCount
                  forkCount
                  pushedAt
                  watchers {
                    totalCount
                  }
                  issues(states: OPEN) {
                    totalCount
                  }
                  pullRequests(states: OPEN) {
                    totalCount
                  }
                  defaultBranchRef {
                    name
                  }
                  primaryLanguage {
                    name
                  }
                }
              }
            `,
            { owner, name },
          );

          return {
            id: repo.id,
            fullName: repo.fullName,
            stars: data.repository.stargazerCount,
            forks: data.repository.forkCount,
            watchers: data.repository.watchers.totalCount,
            openIssues: data.repository.issues.totalCount,
            openPullRequests: data.repository.pullRequests.totalCount,
            defaultBranch: data.repository.defaultBranchRef?.name || 'N/A',
            primaryLanguage: data.repository.primaryLanguage?.name || 'Unknown',
            pushedAt: data.repository.pushedAt,
            lastSyncedAt: repo.lastSyncedAt,
          };
        } catch {
          return {
            id: repo.id,
            fullName: repo.fullName,
            stars: 0,
            forks: 0,
            watchers: 0,
            openIssues: 0,
            openPullRequests: 0,
            defaultBranch: 'N/A',
            primaryLanguage: 'Unknown',
            pushedAt: null,
            lastSyncedAt: repo.lastSyncedAt,
          };
        }
      }),
    );

    return results;
  }
}