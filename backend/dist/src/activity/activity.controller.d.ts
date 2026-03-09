import { ActivityQueryDto } from './dto/activity-query.dto';
import { ActivityService } from './activity.service';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findAll(query: ActivityQueryDto, user: any): Promise<({
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
    timeline(user: any): Promise<({
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
    summary(user: any): Promise<{
        totalEvents: number;
        totalRepositories: number;
        totalBranches: number;
        groupedByType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ActivityEventGroupByOutputType, "type"[]> & {
            _count: {
                type: number;
            };
        })[];
    }>;
    topContributors(user: any): Promise<{
        author: string;
        count: number;
    }[]>;
    analystOverview(user: any): Promise<{
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
