import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate')
  async generateReferralCode(@Req() req: any) {
    const userId = req.user.sub;
    const referralCode =
      await this.referralService.generateReferralCode(userId);
    return { referralCode };
  }

  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getReferralCode(@Req() req: any) {
    const userId = req.user.sub;
    const referralCode = await this.referralService.getReferralCode(userId);
    return { referralCode };
  }

  @Get('validate')
  async validateReferralCode(@Query('code') code: string) {
    const isValid = await this.referralService.validateReferralCode(code);
    if (!isValid) {
      throw new Error('Invalid referral code');
    }
    return { valid: isValid };
  }
}
