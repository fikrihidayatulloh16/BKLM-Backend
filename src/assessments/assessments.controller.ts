import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAssessmentDto } from './dto/create-assessments.dto';
import { AuthenticatedUser, GetUser } from 'src/auth/decorators/get-user.decorators';

@Controller('assessments')
@UseGuards(AuthGuard('jwt'))
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  create(@Body() dto:CreateAssessmentDto, @GetUser() user: AuthenticatedUser) {
    //const user = req.user;
    return this.assessmentsService.createAssessment(dto, user);
  }

  //Mengambil semua assessment untuk user tertentu
  @Get()
  findAll(@GetUser() user: AuthenticatedUser) {
    //const user = req.user;
    return this.assessmentsService.findAllForUser(user);
  }
}
