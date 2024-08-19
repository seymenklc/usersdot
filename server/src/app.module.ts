import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/appConfig.module';
import { DatabaseConfigModule } from './config/database/db.module';
import { DataBaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AppConfigModule, DatabaseConfigModule, DataBaseModule, UsersModule],
})
export class AppModule {}
