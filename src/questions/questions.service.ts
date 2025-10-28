// src/questions/questions.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedUser } from 'src/auth/decorators/get-user.decorators';
import { CreateQuestionDto } from './dto/create-question.dto';


@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  private async _validateAssessmentOwner(assessmentId: string, userId: string) {

    //Mencari assessment berdasarkan assessmentId
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId}
    })

    //Jika assessment tidak ditemukan, maka lempar erro NotFoundException
    if(!assessment){
      throw new NotFoundException('assessment not found')
    }

    //Jika userId dari assessment tidak sesuai dengan userId yang melakukan request, lempar error UnauthorizedException
    if(assessment.creator_id !== userId){
      throw new UnauthorizedException('Anda tidak punya akses ke asesmen ini')
    }

    //Jika lolos validasi kembalikan assessment
    return assessment;
  }

  // Fungsi untuk membuat question baru
  async createQuestion(dto: CreateQuestionDto, user: AuthenticatedUser) {
    // 1. validasi apakah user adalah owner dari assessment yang dituju
    await this._validateAssessmentOwner(dto.assessmentId, user.id);

    return this.prisma.question.create({
      data: {
        question_text: dto.question_text,
        question_type: dto.question_type,
        assessment_id: dto.assessmentId,
        domain_id: dto.domainId,
      },
    });
  }

  // Fungsi untuk mengambil semua question milik satu assessment
  async findAllQuestionsForAssessment(assessmentId: string, user: AuthenticatedUser) {
    await this._validateAssessmentOwner(assessmentId, user.id);

    return this.prisma.question.findMany({
      where: { assessment_id: assessmentId },
    });
  }
}