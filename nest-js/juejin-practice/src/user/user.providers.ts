import { User } from './user.mongo.entity';
import { DataSource } from 'typeorm';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource: DataSource) =>
      AppDataSource.getRepository(User),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
