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

  async handleReferral(userId: number, referralCode: string): Promise<void> {
    const referrer = await this.getReferrer(referralCode);
    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    if (await this.hasExistingReferral(userId)) {
      return;
    }

    await this.processReferral(userId, referrer.id, referralCode);
  }

  private async getReferrer(referralCode: string) {
    return await this.prisma.user.findFirst({
      where: { referralCode },
    });
  }

  private async hasExistingReferral(refereeId: number): Promise<boolean> {
    const existingReferral = await this.prisma.referral.findFirst({
      where: { refereeId },
    });
    return !!existingReferral;
  }

  private async processReferral(
    refereeId: number,
    referrerId: number,
    referralCode: string,
  ): Promise<void> {
    const pointsToAward = 10;

    await Promise.all([
      this.updateRefereeUser(refereeId, referrerId),
      this.updateReferrerPoints(referrerId, pointsToAward),
      this.createReferralRecord(referrerId, refereeId, referralCode),
    ]);
  }

  private async updateRefereeUser(refereeId: number, referrerId: number) {
    return this.prisma.user.update({
      where: { id: refereeId },
      data: { referredBy: referrerId.toString() },
    });
  }

  private async updateReferrerPoints(referrerId: number, points: number) {
    return this.prisma.user.update({
      where: { id: referrerId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  }

  private async createReferralRecord(
    referrerId: number,
    refereeId: number,
    code: string,
  ) {
    return this.prisma.referral.create({
      data: {
        referrerId,
        refereeId,
        code,
        isCompleted: true,
        pointsAwarded: true,
        completedAt: new Date(),
      },
    });
  }

  public async getReferredUserRecord(userId: number) {
    try {
      console.log(userId);

      const response = await this.prisma.referral.findMany({
        where: {
          referrerId: userId,
        },
        select: {
          isCompleted: true,
          pointsAwarded: true,
          completedAt: true,
          createdAt: true,
          referee: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
