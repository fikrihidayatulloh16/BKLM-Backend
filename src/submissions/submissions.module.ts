import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  imports: [PrismaModule],
})
export class SubmissionsModule {}
