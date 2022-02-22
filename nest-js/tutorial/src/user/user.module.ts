import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // 如果我们在 UserHttpModule 中导入 UsersModule ，我们可以在后一个模块的提供者中使用 @InjectRepository(User)。
  exports: [TypeOrmModule],
  providers: [UserService, UserSubscriber],
  controllers: [UserController],
})
export class UserModule {}
