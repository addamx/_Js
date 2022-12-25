import { Module } from '@nestjs/common';
import { MiscController } from './misc/misc.controller';

@Module({
  controllers: [MiscController],
})
export class MiscModule {}
