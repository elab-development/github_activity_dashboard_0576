"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: client_1.RoleName.ADMIN },
        update: {},
        create: { name: client_1.RoleName.ADMIN },
    });
    const analystRole = await prisma.role.upsert({
        where: { name: client_1.RoleName.ANALYST },
        update: {},
        create: { name: client_1.RoleName.ANALYST },
    });
    const viewerRole = await prisma.role.upsert({
        where: { name: client_1.RoleName.VIEWER },
        update: {},
        create: { name: client_1.RoleName.VIEWER },
    });
    const adminPassword = await bcrypt.hash('admin123', 10);
    const guestPassword = await bcrypt.hash('guest123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            fullName: 'Admin User',
            password: adminPassword,
            roleId: adminRole.id,
        },
        create: {
            fullName: 'Admin User',
            email: 'admin@example.com',
            password: adminPassword,
            roleId: adminRole.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'guest@example.com' },
        update: {
            fullName: 'Guest User',
            password: guestPassword,
            roleId: viewerRole.id,
        },
        create: {
            fullName: 'Guest User',
            email: 'guest@example.com',
            password: guestPassword,
            roleId: viewerRole.id,
        },
    });
    await prisma.user.upsert({
        where: { email: 'analyst@example.com' },
        update: {
            fullName: 'Analyst User',
            password: guestPassword,
            roleId: analystRole.id,
        },
        create: {
            fullName: 'Analyst User',
            email: 'analyst@example.com',
            password: guestPassword,
            roleId: analystRole.id,
        },
    });
    console.log('Seed finished successfully');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map