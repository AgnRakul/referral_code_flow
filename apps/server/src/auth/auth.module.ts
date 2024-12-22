import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModel } from 'src/user/user.model';
import { TokenService } from './token.service';
import { ReferralService } from 'src/referral/referral.service';
import { MetaMaskAuthService } from './metamask.service';

// import { TwitterStrategy } from './strategies/twitter.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    PrismaModule,
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    UserModel,
    TokenService,
    ReferralService,
    MetaMaskAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
