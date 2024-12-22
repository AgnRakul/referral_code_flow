import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from './user.model';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserModel],
})
export class UserModule {}
