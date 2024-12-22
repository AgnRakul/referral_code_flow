import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReferralCode(userId: number): Promise<string> {
    const referralCode = `ref_${userId}_${Date.now()}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode },
    });

    return referralCode;
  }

  async getReferralCode(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.referralCode) {
      throw new Error('Referral code not found');
    }

    return user.referralCode;
  }

  async validateReferralCode(referralCode: string): Promise<boolean> {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    return !!referrer;
  }
}
