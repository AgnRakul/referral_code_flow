import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service'; // Assuming you use Prisma
import {
  CanActivate,
  ExecutionContext as NestExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: NestExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.cookies?.['accessToken'];

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const decoded = this.jwtService.verify(token);

      const userId = decoded.sub;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;

      return true;
    } catch (error) {
      console.error('User validation failed:', error);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
