// src/assessments/dto/update-assessments.dto.ts
import { AssessmentStatus } from "@prisma/client";
import { IsNotEmpty,  IsUUID} from "class-validator";

export class UpdateAssessmentDto {
    // @IsNotEmpty()
    // @IsUUID()
    // id: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    status: AssessmentStatus;
}