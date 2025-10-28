// src/questions/dto/create-question.dto.ts
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question_text: string;

  @IsNotEmpty()
  @IsEnum(['multiple_choice', 'yes_no', 'short_answer'])
  question_type: string;

  @IsNotEmpty()
  @IsUUID()
  assessmentId: string;

  @IsNotEmpty()
  @IsUUID()
  domainId: string;
}