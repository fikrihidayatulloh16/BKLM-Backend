import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessments.dto'
import { AuthenticatedUser } from '../auth/decorators/get-user.decorators';
import { UpdateAssessmentDto } from './dto/update-assessments.dto';
import { AssessmentStatus } from '@prisma/client';

@Injectable()
export class AssessmentsService {
    constructor(private readonly prisma: PrismaService) {}

    //Membuat assessment baru
    async createAssessment(dto: CreateAssessmentDto, user: AuthenticatedUser) {
        return this.prisma.assessment.create({
            data: {
                ...dto,
                creator_id: user.id,
                school_id: user.school_id,
            }
        })
    }

    //Mengambil semua assessment untuk user tertentu

    async findAllForUser(user: AuthenticatedUser) {
        return this.prisma.assessment.findMany({
            where: {
                school_id: user.school_id,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
    }
    //Mengubah assessment
    async updateAssessment(id: string, dto: UpdateAssessmentDto) {
        return this.prisma.assessment.update({
            where: { id },
            data: {
                ...dto,
            }
        })
    }
}