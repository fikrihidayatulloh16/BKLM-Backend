// src/submissions/submissions.service.ts
import { Injectable, NotFoundException, ConflictException,ForbiddenException, } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  // "Normalisasi" nama: "Andi Budi" -> "andibudi"
  private _normalizeIdentifier(name: string, studentClass: string): string {
    const normName = name.toLowerCase().replace(/\s+/g, '');
    const normClass = studentClass.toLowerCase().replace(/\s+/g, '');
    return `${normName}_${normClass}`;
  }

  // Validasi Asesmen (versi lengkap)
  private async _validateAssessment(assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException('Asesmen tidak ditemukan!');
    }

    // CEK 1: Apakah sudah di-publish?
    if (assessment.status !== 'PUBLISHED') {
      throw new ForbiddenException('Asesmen ini belum dibuka.');
    }

    // CEK 2: Apakah sudah kedaluwarsa?
    if (assessment.expires_at && assessment.expires_at < new Date()) {
      throw new ForbiddenException('Batas waktu asesmen ini telah berakhir.');
    }
    
    // Anda benar, kita tidak perlu cek creator_id di sini
    return assessment;
  }

  // Membuat submission baru (dengan transaksi)
  async createSubmission(assessmentId: string, dto: CreateSubmissionDto) {
    // 1. Eksekusi validasi asesmen
    await this._validateAssessment(assessmentId);

    // 2. Buat identifier unik (Solusi A kita)
    const identifier = this._normalizeIdentifier(dto.student_name, dto.student_class);

    // 3. Gunakan Transaksi!
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 3a. Buat "halaman sampul" submission
        const submission = await tx.submission.create({
          data: {
            student_identifier: identifier,
            student_name: dto.student_name,
            student_class: dto.student_class,
            assessment_id: assessmentId,
          },
        });

        // 3b. Siapkan data jawaban
        const answersData = dto.answers.map((answer) => ({
          ...answer,
          submission_id: submission.id,
        }));

        // 3c. Buat semua jawaban sekaligus
        await tx.answer.createMany({
          data: answersData,
        });

        return submission; // Kembalikan data submission
      });
    } catch (error) {
      // Tangani error jika siswa sudah pernah submit (unique constraint)
      if (error.code === 'P2002') {
        throw new ConflictException('Anda sudah pernah mengirimkan asesmen ini.');
      }
      throw error;
    }
  }
}