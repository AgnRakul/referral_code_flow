import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  generateTokens(payload: { email: string; sub: number }): TokenPair {
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '8h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async saveTokens(userId: number, tokens: TokenPair): Promise<void> {
    await this.prisma.token.upsert({
      where: { userId },
      update: {
        ...tokens,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        user: { connect: { id: userId } },
        ...tokens,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
