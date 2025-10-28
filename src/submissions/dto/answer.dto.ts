// src/submissions/dto/answer.dto.ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AnswerDto {
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @IsNotEmpty()
  @IsString()
  answer_value: string; // "1", "0", atau "option_id"
}