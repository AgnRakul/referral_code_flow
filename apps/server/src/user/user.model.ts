import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserModel {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        hasSecondaryAuth: true,
        referralCode: true,
        referredBy: true,
      },
    });
  }

  async checkUserExists(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(email: string, updateData: any) {
    return await this.prisma.user.update({
      where: { email },
      data: updateData,
    });
  }

  async createUser(
    email: string,
    provider: 'GOOGLE' | 'TWITTER' | 'APPLE' | 'WALLET',
    user: any,
    id: any,
  ) {
    return await this.prisma.user.create({
      data: {
        email,
        [`${provider.toLowerCase()}Id`]: id,
        name: user.name || null,
        hasPrimaryAuth: true,
      },
    });
  }

  async getReferralCodeForUser(code: string) {
    return await this.prisma.user.findFirst({
      where: {
        referralCode: code,
      },
    });
  }
}
