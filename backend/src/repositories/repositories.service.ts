import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventType } from '@prisma/client';
import { Octokit } from '@octokit/rest';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';

@Injectable()
export class RepositoriesService {
  private readonly octokit: Octokit;

  constructor(private readonly prisma: PrismaService) {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });
  }

  async findAll(userId: number, role: string) {
    return this.prisma.repository.findMany({
      where: role === 'ADMIN' ? {} : { userId },
      include: {
        branches: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id,
        ...(role === 'ADMIN' ? {} : { userId }),
      },
      include: {
        branches: true,
        activities: {
          orderBy: { occurredAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    return repository;
  }

  async create(dto: CreateRepositoryDto, userId: number) {
    const existing = await this.prisma.repository.findFirst({
      where: {
        fullName: dto.fullName,
        userId,
      },
    });

    if (existing) {
      throw new BadRequestException('You are already tracking this repository');
    }

    const [owner, repo] = dto.fullName.split('/');

    const repoResponse = await this.octokit.repos.get({
      owner,
      repo,
    });

    return this.prisma.repository.create({
      data: {
        name: repoResponse.data.name,
        fullName: repoResponse.data.full_name,
        owner: repoResponse.data.owner.login,
        url: repoResponse.data.html_url,
        description: repoResponse.data.description || null,
        userId,
      },
    });
  }

  async sync(id: number, userId: number, role: string) {
    const repository = await this.prisma.repository.findFirst({
      where: {
        id,
        ...(role === 'ADMIN' ? {} : { userId }),
      },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    const [owner, repo] = repository.fullName.split('/');

    await this.prisma.activityEvent.deleteMany({
      where: { repositoryId: repository.id },
    });

    await this.prisma.branch.deleteMany({
      where: { repositoryId: repository.id },
    });

    const [commitsRes, issuesRes, pullsRes, branchesRes] = await Promise.all([
      this.octokit.repos.listCommits({ owner, repo, per_page: 20 }),
      this.octokit.issues.listForRepo({ owner, repo, state: 'all', per_page: 20 }),
      this.octokit.pulls.list({ owner, repo, state: 'all', per_page: 20 }),
      this.octokit.repos.listBranches({ owner, repo, per_page: 20 }),
    ]);

    for (const branch of branchesRes.data) {
      await this.prisma.branch.create({
        data: {
          name: branch.name,
          repositoryId: repository.id,
        },
      });

      await this.prisma.activityEvent.create({
        data: {
          type: EventType.BRANCH,
          title: `Branch: ${branch.name}`,
          description: `Branch ${branch.name} exists on repository ${repository.fullName}`,
          author: repository.owner,
          occurredAt: new Date(),
          repositoryId: repository.id,
        },
      });
    }

    for (const commit of commitsRes.data) {
      await this.prisma.activityEvent.create({
        data: {
          githubEventId: commit.sha,
          type: EventType.COMMIT,
          title: commit.commit.message.split('\n')[0],
          description: commit.commit.message,
          author: commit.author?.login || commit.commit.author?.name || 'Unknown',
          authorAvatar: commit.author?.avatar_url || null,
          occurredAt: commit.commit.author?.date
            ? new Date(commit.commit.author.date)
            : new Date(),
          repositoryId: repository.id,
        },
      });
    }

    const onlyIssues = issuesRes.data.filter((item) => !item.pull_request);

    for (const issue of onlyIssues) {
      await this.prisma.activityEvent.create({
        data: {
          githubEventId: String(issue.id),
          type: issue.state === 'open' ? EventType.ISSUE_OPENED : EventType.ISSUE_CLOSED,
          title: issue.title,
          description: issue.body || null,
          author: issue.user?.login || 'Unknown',
          authorAvatar: issue.user?.avatar_url || null,
          occurredAt: issue.created_at ? new Date(issue.created_at) : new Date(),
          repositoryId: repository.id,
        },
      });
    }

    for (const pr of pullsRes.data) {
      await this.prisma.activityEvent.create({
        data: {
          githubEventId: String(pr.id),
          type: pr.state === 'open' ? EventType.PR_OPENED : EventType.PR_CLOSED,
          title: pr.title,
          description: pr.body || null,
          author: pr.user?.login || 'Unknown',
          authorAvatar: pr.user?.avatar_url || null,
          occurredAt: pr.created_at ? new Date(pr.created_at) : new Date(),
          repositoryId: repository.id,
        },
      });
    }

    await this.prisma.repository.update({
      where: { id: repository.id },
      data: {
        lastSyncedAt: new Date(),
      },
    });

    return {
      message: 'Repository synced successfully',
    };
  }
}