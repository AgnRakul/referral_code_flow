import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(
    user: any,
    provider: 'GOOGLE' | 'TWITTER' | 'APPLE' | 'WALLET',
    referralCode: string | undefined,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, id } = user;

    let existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const updateData: any = {};
      if (provider === 'GOOGLE' && !existingUser.googleId) {
        updateData.googleId = id;
      }
      if (Object.keys(updateData).length > 0) {
        existingUser = await this.prisma.user.update({
          where: { email },
          data: updateData,
        });
      }
    } else {
      existingUser = await this.prisma.user.create({
        data: {
          email,
          [`${provider.toLowerCase()}Id`]: id,
          name: user.name || null,
          hasPrimaryAuth: true,
        },
      });

      if (referralCode) {
        const referrer = await this.prisma.user.findUnique({
          where: { referralCode },
        });

        if (referrer) {
          const pointsToAward = parseInt(
            process.env.REFERRAL_POINTS || '10',
            10,
          );
          await this.prisma.user.update({
            where: { id: referrer.id },
            data: { points: referrer.points + pointsToAward },
          });

          await this.prisma.referral.create({
            data: {
              referrerId: referrer.id,
              refereeId: existingUser.id,
              code: referralCode,
              isCompleted: true,
              pointsAwarded: true,
              completedAt: new Date(),
            },
          });
        }
      }
    }

    const payload = { email: existingUser.email, sub: existingUser.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.prisma.token.upsert({
      where: { userId: existingUser.id },
      update: {
        refreshToken,
        accessToken,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        user: {
          connect: { id: existingUser.id },
        },
        accessToken,
        refreshToken,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
