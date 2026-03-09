import { IsOptional, IsString } from 'class-validator';

export class ActivityQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  repositoryId?: string;
}