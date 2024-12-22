import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [], // Ensure JwtService is imported
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
