import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('misc')
export class MiscController {
  constructor(private configService: ConfigService) {}

  @Get('config-test')
  getTestName(): string {
    return this.configService.get('TEST_VALUE').name;
  }
}
