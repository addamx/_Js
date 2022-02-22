import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { logger } from './common/middleware/logger.middleware';
import { APP_PIPE, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './common/guard/roles.guard';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CatsModule,
    TypeOrmModule.forRoot(
      // {
      //   type: 'mysql',
      //   host: 'localhost',
      //   port: 3306,
      //   username: 'root',
      //   password: 'root',
      //   database: 'nestjs-tutorial',
      // // 每个通过forFeature()注册的实体都会自动添加到配置对象的entities数组中。
      //   autoLoadEntities: true,
      //   synchronize: true,
      // }
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(logger)
      // .exclude(
      //   { path: 'cats', method: RequestMethod.POST },
      //   'cats/(.*)',
      // )
      // .forRoutes('cats')
      // .forRoutes(CatsController)
      .forRoutes({ path: 'cats', method: RequestMethod.ALL });
  }
}
