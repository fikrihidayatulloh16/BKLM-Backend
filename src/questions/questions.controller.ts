// src/questions/questions.controller.ts
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from 'src/auth/decorators/get-user.decorators';
import { use } from 'passport';

@UseGuards(AuthGuard('jwt'))
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() dto: CreateQuestionDto, @GetUser() user: AuthenticatedUser) {
    return this.questionsService.createQuestion(dto, user);
  }

  @Get('by-assessment/:assessmentId')
  findAllQuestionsForAssessment(@Param('assessmentId') assessmentId: string, @GetUser() user: AuthenticatedUser) {
    return this.questionsService.findAllQuestionsForAssessment(assessmentId, user);
  }
}
