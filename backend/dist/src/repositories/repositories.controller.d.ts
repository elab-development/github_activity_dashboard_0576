import { CreateRepositoryDto } from './dto/create-repository.dto';
import { RepositoriesService } from './repositories.service';
export declare class RepositoriesController {
    private readonly repositoriesService;
    constructor(repositoriesService: RepositoriesService);
    findAll(user: any): Promise<({
        _count: {
            activities: number;
        };
        branches: {
            id: number;
            name: string;
            createdAt: Date;
            repositoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        fullName: string;
        createdAt: Date;
        updatedAt: Date;
        owner: string;
        url: string;
        description: string | null;
        isActive: boolean;
        lastSyncedAt: Date | null;
        userId: number;
    })[]>;
    findOne(id: number, user: any): Promise<{
        branches: {
            id: number;
            name: string;
            createdAt: Date;
            repositoryId: number;
        }[];
        activities: {
            id: number;
            createdAt: Date;
            description: string | null;
            occurredAt: Date;
            githubEventId: string | null;
            type: import(".prisma/client").$Enums.EventType;
            title: string;
            author: string;
            authorAvatar: string | null;
            repositoryId: number;
        }[];
    } & {
        id: number;
        name: string;
        fullName: string;
        createdAt: Date;
        updatedAt: Date;
        owner: string;
        url: string;
        description: string | null;
        isActive: boolean;
        lastSyncedAt: Date | null;
        userId: number;
    }>;
    create(dto: CreateRepositoryDto, user: any): Promise<{
        id: number;
        name: string;
        fullName: string;
        createdAt: Date;
        updatedAt: Date;
        owner: string;
        url: string;
        description: string | null;
        isActive: boolean;
        lastSyncedAt: Date | null;
        userId: number;
    }>;
    sync(id: number, user: any): Promise<{
        message: string;
    }>;
}
