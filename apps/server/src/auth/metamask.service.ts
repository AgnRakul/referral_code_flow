import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MetaMaskAuthService {
  constructor(private prisma: PrismaService) {}

  async storeMetaMaskAddress(userId: number, walletAddress: string) {
    try {
      const findAddress = await this.prisma.user.findFirst({
        where: {
          walletAddress: walletAddress,
        },
        select: {
          walletAddress: true,
        },
      });

      if (findAddress.walletAddress) {
        throw new Error('Connect to Another Account');
      }

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { walletAddress },
        select: {
          walletAddress: true,
        },
      });

      return { message: 'MetaMask address stored successfully', user };
    } catch (error) {
      return {
        success: false,
        message:
          'The MetaMask Wallet is Connect to Another Account ( Logout Your MetaMask Account )',
      };
    }
  }
}
