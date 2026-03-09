import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(): Promise<{
        message: string;
    }>;
    me(user: any): Promise<{
        id: number;
        role: {
            name: import(".prisma/client").$Enums.RoleName;
        };
        email: string;
        fullName: string;
        createdAt: Date;
    }>;
}
