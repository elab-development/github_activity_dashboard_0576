import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            fullName: any;
            email: any;
            role: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            fullName: any;
            email: any;
            role: any;
        };
    }>;
    me(userId: number): Promise<{
        id: number;
        role: {
            name: import(".prisma/client").$Enums.RoleName;
        };
        email: string;
        fullName: string;
        createdAt: Date;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    private buildAuthResponse;
}
