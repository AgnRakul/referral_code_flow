import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get()
  @UseGuards(UserGuard)
  async getUser(@Req() req: Record<string, any>) {
    return await this.user.getUser(req.user.id);
  }
}
