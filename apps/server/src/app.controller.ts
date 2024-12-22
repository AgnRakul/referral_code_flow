import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('ping')
  checkService() {
    return {
      message: 'API is running',
      status: 200,
    };
  }
}
