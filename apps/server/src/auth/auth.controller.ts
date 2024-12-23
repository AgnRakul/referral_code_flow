import {
  Body,
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
import { MetaMaskAuthService } from './metamask.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly metamaskAuthService: MetaMaskAuthService,
  ) {}

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
      const payload = this.jwtService.verify(token);
      console.log('Decoded Payload:', payload);

      // I need to check in database that the user is tehre with the payload.sub

      return {
        message: 'Authentication validated successfully',
        user: {
          email: payload.email,
          userId: payload.sub,
        },
        success: true,
      };
    } catch (error) {
      console.error('Token validation error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('google')
  googleLogin(
    @Query('referralCode') referralCode: string,
    @Res() res: Response,
  ) {
    const state = JSON.stringify({ referralCode });

    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile%20email&state=${encodeURIComponent(
      state,
    )}`;

    res.redirect(googleAuthURL);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const referralCode = req.user.referralCode; // Access referral code

      const { accessToken, refreshToken } = await this.authService.register(
        req.user,
        'GOOGLE',
        referralCode,
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
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

  @Post('metamask-authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticateWithMetaMask(
    @Body() body: { walletAddress: string },
    @Req() req: any,
  ) {
    const { walletAddress } = body;

    return await this.metamaskAuthService.storeMetaMaskAddress(
      req.user.userId,
      walletAddress,
    );
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
