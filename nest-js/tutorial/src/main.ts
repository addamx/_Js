import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
// import { RolesGuard } from './common/guard/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const tasksService = app.get(TasksService);
  // 更喜欢严格的上下文检查，则可以使用 strict: true
  // const tasksService = app.select(TasksModule).get(TasksService, { strict: true });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new RolesGuard);
  // app.useGlobalInterceptors(new LoggingInterceptor)
  await app.listen(3000);
}
bootstrap();
