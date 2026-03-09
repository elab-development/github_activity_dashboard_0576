import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { RepositoriesService } from './repositories.service';

@ApiTags('Repositories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.repositoriesService.findAll(user.userId, user.role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.repositoriesService.findOne(id, user.userId, user.role);
  }

  @Roles('ADMIN', 'ANALYST', 'VIEWER')
  @Post()
  create(@Body() dto: CreateRepositoryDto, @CurrentUser() user: any) {
    return this.repositoriesService.create(dto, user.userId);
  }

  @Roles('ADMIN', 'ANALYST', 'VIEWER')
  @Post(':id/sync')
  sync(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.repositoriesService.sync(id, user.userId, user.role);
  }
}