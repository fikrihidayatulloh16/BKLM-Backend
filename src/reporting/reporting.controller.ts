import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from 'src/auth/decorators/get-user.decorators';

@Controller('reporting')
@UseGuards(AuthGuard('jwt'))
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get(':id/results')
  getAssessmentResults(
    @Param('id') assessmentId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.reportingService.getAssessmentResults(assessmentId, user);
  }
}
