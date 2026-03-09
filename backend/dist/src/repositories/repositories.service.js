"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const rest_1 = require("@octokit/rest");
const prisma_service_1 = require("../prisma/prisma.service");
let RepositoriesService = class RepositoriesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.octokit = new rest_1.Octokit({
            auth: process.env.GITHUB_TOKEN || undefined,
        });
    }
    async findAll(userId, role) {
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
    async findOne(id, userId, role) {
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
            throw new common_1.NotFoundException('Repository not found');
        }
        return repository;
    }
    async create(dto, userId) {
        const existing = await this.prisma.repository.findFirst({
            where: {
                fullName: dto.fullName,
                userId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You are already tracking this repository');
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
    async sync(id, userId, role) {
        const repository = await this.prisma.repository.findFirst({
            where: {
                id,
                ...(role === 'ADMIN' ? {} : { userId }),
            },
        });
        if (!repository) {
            throw new common_1.NotFoundException('Repository not found');
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
                    type: client_1.EventType.BRANCH,
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
                    type: client_1.EventType.COMMIT,
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
                    type: issue.state === 'open' ? client_1.EventType.ISSUE_OPENED : client_1.EventType.ISSUE_CLOSED,
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
                    type: pr.state === 'open' ? client_1.EventType.PR_OPENED : client_1.EventType.PR_CLOSED,
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
};
exports.RepositoriesService = RepositoriesService;
exports.RepositoriesService = RepositoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RepositoriesService);
//# sourceMappingURL=repositories.service.js.map