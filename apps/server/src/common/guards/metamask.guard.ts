import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MetaMaskGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.walletAddress) {
      throw new UnauthorizedException(
        'Please authenticate with MetaMask to access this page.',
      );
    }

    return true;
  }
}
