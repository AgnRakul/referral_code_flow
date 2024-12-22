import { Injectable } from '@nestjs/common';
import { ReferralService } from 'src/referral/referral.service';

import { UserModel } from 'src/user/user.model';
import { TokenService, TokenPair } from './token.service';

type AuthProvider = 'GOOGLE' | 'TWITTER' | 'APPLE' | 'WALLET';

interface AuthUser {
  email: string;
  id: string;
  [key: string]: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UserModel,
    private readonly referralService: ReferralService,
    private readonly tokenService: TokenService,
  ) {}

  async register(
    user: AuthUser,
    provider: AuthProvider,
    referralCode?: string,
  ): Promise<TokenPair> {
    const existingUser = await this.handleUserRegistration(user, provider);

    if (referralCode) {
      await this.referralService.handleReferral(existingUser.id, referralCode);
    }

    const tokens = this.tokenService.generateTokens({
      email: existingUser.email,
      sub: existingUser.id,
    });

    await this.tokenService.saveTokens(existingUser.id, tokens);

    return tokens;
  }

  private async handleUserRegistration(user: AuthUser, provider: AuthProvider) {
    const existingUser = await this.userModel.checkUserExists(user.email);

    if (existingUser) {
      return this.updateExistingUser(existingUser, user, provider);
    }

    return this.userModel.createUser(user.email, provider, user, user.id);
  }

  private async updateExistingUser(
    existingUser: any,
    user: AuthUser,
    provider: AuthProvider,
  ) {
    const updateData: any = {};

    if (provider === 'GOOGLE' && !existingUser.googleId) {
      updateData.googleId = user.id;
    }

    if (Object.keys(updateData).length > 0) {
      return this.userModel.updateUser(user.email, updateData);
    }

    return existingUser;
  }
}
