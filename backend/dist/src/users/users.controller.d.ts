import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
