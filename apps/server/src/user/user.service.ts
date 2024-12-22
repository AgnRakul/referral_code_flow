import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly user_model: UserModel) {}

  async getUser(userId: number) {
    try {
      const user = await this.user_model.getUser(userId);

      return {
        success: true,
        data: user,
        message: 'User found',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'User not found',
      };
    }
  }
}
