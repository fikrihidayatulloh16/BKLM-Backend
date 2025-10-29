import { Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReportingModule } from 'src/reporting/reporting.module';

@Module({
  imports: [PrismaModule, ReportingModule],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
})
export class AssessmentsModule {}
