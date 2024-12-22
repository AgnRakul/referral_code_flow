import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // Logout route to clear cookies
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });

    return res.status(200).send({ message: 'Logged out successfully' });
  }

  @Get('validate')
  validateAuth(@Req() req: Request) {
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      // Verify the token using JwtService
      const payload = this.jwtService.verify(token);
      console.log('Decoded Payload:', payload); // Log the payload for debugging

      // Send only user-related information in the response (avoiding circular structure)
      return {
        message: 'Authentication validated successfully',
        user: {
          email: payload.email, // Return specific details from the payload
          userId: payload.sub, // Return the userId or any relevant information
        },
        success: true,
      };
    } catch (error) {
      console.error('Token validation error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return 'Redirecting to Google for authentication...';
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Query('referralCode') referralCode: string,
    @Res() res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.register(
        req.user,
        'GOOGLE',
        referralCode,
      );

      // Set cookies for all environments
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to dashboard
      res.redirect(`${process.env.APP_CLIENT_URL}/dashboard`);
    } catch (error) {
      console.error('Error during Google callback:', error);
      return res
        .status(500)
        .send({ message: 'An error occurred during login.' });
    }
  }

  // @Get('twitter')
  // @UseGuards(AuthGuard('twitter'))
  // twitterLogin(@Query('referralCode') referralCode: string) {
  //   return `Redirecting to Twitter for authentication with referral code: ${referralCode}`;
  // }

  // @Get('twitter/callback')
  // @UseGuards(AuthGuard('twitter'))
  // async twitterCallback(
  //   @Req() req: any,
  //   @Query('referralCode') referralCode: string,
  //   @Res() res: Response,
  // ) {
  //   await this.authService.register(req.user, 'TWITTER', referralCode, res);
  //   return res.redirect('/dashboard');
  // }
}
