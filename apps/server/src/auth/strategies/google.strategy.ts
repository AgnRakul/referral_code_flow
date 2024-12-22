import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    _: string,
    __: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const state = req.query.state ? JSON.parse(req.query.state) : {};
    const { id, emails, displayName } = profile;

    const user = {
      id,
      email: emails[0].value,
      name: displayName,
      referralCode: state.referralCode,
    };

    done(null, user);
  }
}
