import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.['accessToken'];

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    request.headers.authorization = `Bearer ${token}`;

    try {
      return super.canActivate(context);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
