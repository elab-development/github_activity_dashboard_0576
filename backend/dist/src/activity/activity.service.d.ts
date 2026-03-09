import { PrismaService } from '../prisma/prisma.service';
import { ActivityQueryDto } from './dto/activity-query.dto';
export declare class ActivityService {
    private readonly prisma;
    private readonly graphqlWithAuth;
    constructor(prisma: PrismaService);
    findAll(query: ActivityQueryDto, userId: number, role: string): Promise<({
        repository: {
            id: number;
            fullName: string;
        };
    } & {
        id: number;
        githubEventId: string | null;
        type: import(".prisma/client").$Enums.EventType;
        title: string;
        description: string | null;
        author: string;
        authorAvatar: string | null;
        occurredAt: Date;
        repositoryId: number;
        createdAt: Date;
    })[]>;
    timeline(userId: number, role: string): Promise<({
        repository: {
            id: number;
            fullName: string;
        };
    } & {
        id: number;
        githubEventId: string | null;
        type: import(".prisma/client").$Enums.EventType;
        title: string;
        description: string | null;
        author: string;
        authorAvatar: string | null;
        occurredAt: Date;
        repositoryId: number;
        createdAt: Date;
    })[]>;
    summary(userId: number, role: string): Promise<{
        totalEvents: number;
        totalRepositories: number;
        totalBranches: number;
        groupedByType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ActivityEventGroupByOutputType, "type"[]> & {
            _count: {
                type: number;
            };
        })[];
    }>;
    topContributors(userId: number, role: string): Promise<{
        author: string;
        count: number;
    }[]>;
    analystOverview(userId: number, role: string): Promise<{
        id: number;
        fullName: string;
        stars: any;
        forks: any;
        watchers: any;
        openIssues: any;
        openPullRequests: any;
        defaultBranch: any;
        primaryLanguage: any;
        pushedAt: any;
        lastSyncedAt: Date;
    }[]>;
}
