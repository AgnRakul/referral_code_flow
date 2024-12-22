import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ReferralModule } from './referral/referral.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make .env variables globally accessible
    }),
    AuthModule,
    PrismaModule,
    ReferralModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
