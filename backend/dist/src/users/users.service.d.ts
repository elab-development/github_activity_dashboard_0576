import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        role: {
            name: import(".prisma/client").$Enums.RoleName;
        };
        email: string;
        fullName: string;
        createdAt: Date;
    }[]>;
}
