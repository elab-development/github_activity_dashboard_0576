import { IsString, Matches } from 'class-validator';

export class CreateRepositoryDto {

  @IsString()
  @Matches(/^[\w.-]+\/[\w.-]+$/)
  fullName: string;

}
