import { PrismaService } from '../prisma/prisma.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
export declare class RepositoriesService {
    private readonly prisma;
    private readonly octokit;
    constructor(prisma: PrismaService);
    findAll(userId: number, role: string): Promise<({
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
    findOne(id: number, userId: number, role: string): Promise<{
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
    create(dto: CreateRepositoryDto, userId: number): Promise<{
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
    sync(id: number, userId: number, role: string): Promise<{
        message: string;
    }>;
}
