// src/submissions/dto/create-submission.dto.ts
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { AnswerDto } from "./answer.dto";
import { Type } from "class-transformer";

export class CreateSubmissionDto {
    // @IsString()
    // @IsNotEmpty()
    // student_identifier: string;

    @IsString()
    @IsNotEmpty()
    student_name: string;

    @IsNotEmpty()
    @IsString()
    student_class: string;

    // @IsUUID()
    // @IsNotEmpty()
    // assessmentId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
    }