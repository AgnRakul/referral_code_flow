import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';

import { UserGuard } from 'src/common/guards/user.guard';
import { MetaMaskGuard } from 'src/common/guards/metamask.guard';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('generate')
  @UseGuards(UserGuard)
  async generateReferralCode(@Req() req: any) {
    const referralCode = await this.referralService.generateReferralCode(
      req.user.id,
    );
    return { referralCode };
  }

  @Get('list')
  @UseGuards(UserGuard, MetaMaskGuard)
  async getReferredUserList(@Req() req: any) {
    return await this.referralService.getReferredUserRecord(req.user.id);
  }
}
