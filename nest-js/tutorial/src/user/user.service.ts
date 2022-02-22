import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from './entity/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private connection: Connection
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createMany(users: User[]) {
    const queryRunner = this.connection.createQueryRunner();
  
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);
  
      await queryRunner.commitTransaction();
    } catch (err) {
      //如果遇到错误，可以回滚事务
      await queryRunner.rollbackTransaction();
    } finally {
      //你需要手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }
  
}
