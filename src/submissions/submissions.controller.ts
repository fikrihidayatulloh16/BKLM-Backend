// src/submissions/submissions.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

// Kita ubah base path-nya agar lebih logis
@Controller('assessments')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // Endpoint-nya menjadi: POST /assessments/:assessmentId/submit
  @Post(':assessmentId/submit')
  async createSubmission(
    @Param('assessmentId') assessmentId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    // Service kita sekarang menerima 2 parameter
    return this.submissionsService.createSubmission(assessmentId, dto);
  }
}