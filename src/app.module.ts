import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DomainsModule } from './domains/domains.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { QuestionsModule } from './questions/questions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule,
    UsersModule, 
    DomainsModule, AssessmentsModule, QuestionsModule, SubmissionsModule, ReportingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
