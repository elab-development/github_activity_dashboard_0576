import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { ActivityService } from './activity.service';

@ApiTags('Activity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(@Query() query: ActivityQueryDto, @CurrentUser() user: any) {
    return this.activityService.findAll(query, user.userId, user.role);
  }

  @Get('timeline')
  timeline(@CurrentUser() user: any) {
    return this.activityService.timeline(user.userId, user.role);
  }

  @Get('stats/summary')
  summary(@CurrentUser() user: any) {
    return this.activityService.summary(user.userId, user.role);
  }

  @Get('stats/contributors')
  topContributors(@CurrentUser() user: any) {
    return this.activityService.topContributors(user.userId, user.role);
  }

  @Get('stats/analyst-overview')
  analystOverview(@CurrentUser() user: any) {
    return this.activityService.analystOverview(user.userId, user.role);
  }
}