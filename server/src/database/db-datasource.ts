import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

config();
const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'mysql',
  logging: false,
  synchronize: false,
  host: configService.getOrThrow('MYSQL_HOST'),
  port: parseInt(configService.getOrThrow('MYSQL_PORT')),
  username: configService.getOrThrow('MYSQL_USERNAME'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
  database: configService.getOrThrow('MYSQL_DB_NAME'),
  migrations: [`${path.resolve()}/src/database/migrations/**/*{.ts,.js}`],
  entities: [`${path.resolve()}/src/database/entities/**/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});

export default dataSource;
