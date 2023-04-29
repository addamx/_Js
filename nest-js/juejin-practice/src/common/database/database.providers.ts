import { DataSourceOptions, DataSource } from 'typeorm';
import { getConfig } from '@/utils';
import { User } from '../../user/user.mongo.entity';

const databaseType: DataSourceOptions['type'] = 'mongodb';
const { MONGODB_CONFIG } = getConfig();

const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: databaseType,
  // 注释原因：报错，Cannot use import statement outside a module
  // entities: [
  //   path.join(
  //     __dirname,
  //     `../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`,
  //   ),
  // ],
  entities: [User],
};
console.log('🚀 ~ MONGODB_DATABASE_CONFIG', MONGODB_DATABASE_CONFIG);

const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG);

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      await MONGODB_DATA_SOURCE.initialize();
      console.log(
        '🚀 ~ useFactory: ~ MONGODB_DATA_SOURCE.manager.count()',
        MONGODB_DATA_SOURCE.manager.insert(User, { id: '11', name: 'bbb' }),
      );
      return MONGODB_DATA_SOURCE;
    },
  },
];
