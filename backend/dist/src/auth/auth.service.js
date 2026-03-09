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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const requestedRole = dto.role;
        const roleName = requestedRole && Object.values(client_1.RoleName).includes(requestedRole)
            ? requestedRole
            : client_1.RoleName.VIEWER;
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.BadRequestException('Invalid role');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                email: dto.email,
                password: hashedPassword,
                roleId: role.id,
            },
            include: {
                role: true,
            },
        });
        return this.buildAuthResponse(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResponse(user);
    }
    async me(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
    buildAuthResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map