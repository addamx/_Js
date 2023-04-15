import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessException } from './common/exceptions/business.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('throw-error')
  throwError() {
    const a: any = {};
    console.log(a.b.c);
    return {};
  }

  @Get('throw-bus-error')
  throwBUssinessError() {
    const a: any = {};
    try {
      console.log(a.b.c);
    } catch (error) {
      throw new BusinessException('自定义业务错误');
    }
    return {};
  }
}
