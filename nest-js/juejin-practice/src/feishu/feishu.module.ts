import { Module } from '@nestjs/common';
import { FeishuController } from './feishu.controller';
import { FeishuService } from './fieshu.service';

@Module({
  controllers: [FeishuController],
  providers: [FeishuService],
})
export class FeishuModule {}
