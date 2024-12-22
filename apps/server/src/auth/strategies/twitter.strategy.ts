import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true,
    });
  }

  async validate(_: string, __: string, profile: any): Promise<any> {
    const { id, emails, displayName } = profile;

    return {
      id: id,
      email: emails ? emails[0].value : null,
      name: displayName,
    };
  }
}
