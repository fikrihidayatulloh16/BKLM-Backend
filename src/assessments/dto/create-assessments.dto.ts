import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssessmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
