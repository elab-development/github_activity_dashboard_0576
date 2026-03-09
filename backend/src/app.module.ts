import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { ActivityModule } from './activity/activity.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    RepositoriesModule,
    ActivityModule,
    UsersModule,
  ],
})
export class AppModule {}