import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createConnection, type RowDataPacket } from 'mysql2/promise';
import type { ConnectOptions } from 'typeorm';
import { exec } from 'child_process';

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get type() {
    return this.configService.get('database.mysql.type');
  }
  get mysqlHost() {
    return this.configService.get('database.mysql.mysqlHost');
  }
  get mysqlPort() {
    return this.configService.get('database.mysql.mysqlPort');
  }
  get mysqlUserName() {
    return this.configService.get('database.mysql.mysqlUserName');
  }
  get mysqlPassword() {
    return this.configService.get('database.mysql.mysqlPassword');
  }
  get mysqlDbName() {
    return this.configService.get('database.mysql.mysqlDbName');
  }
  get entities() {
    return this.configService.get('database.mysql.entities');
  }
  get migrations() {
    return this.configService.get('database.mysql.migrations');
  }

  get connections() {
    return {
      type: this.type,
      host: this.mysqlHost,
      port: this.mysqlPort,
      username: this.mysqlUserName,
      password: this.mysqlPassword,
      database: this.mysqlDbName,
      entities: this.entities,
    } as Partial<ConnectOptions>;
  }

  async ensureDatabase() {
    const initialConfig = {
      host: this.mysqlHost,
      user: this.mysqlUserName,
      password: this.mysqlPassword,
      port: this.mysqlPort,
    };

    const initialConnection = await createConnection(initialConfig);

    const [rows] = await initialConnection.query<RowDataPacket[]>(
      `SHOW DATABASES LIKE '${this.mysqlDbName}';`,
    );

    if (rows.length === 0) {
      console.log('Database not found, creating...');
      await initialConnection.query(`CREATE DATABASE ${this.mysqlDbName};`);
      console.log('Database created!');
      await initialConnection.end();
    }

    const connection = await createConnection({
      ...initialConfig,
      database: this.mysqlDbName,
    });

    const [tableRows] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*)
       FROM information_schema.tables
       WHERE table_schema = '${this.mysqlDbName}';
       `,
    );

    const isDbTablesExist = Object.values(tableRows[0])[0] > 0;

    if (!isDbTablesExist) {
      console.log('Database tables not found, creating... ');
      console.info(
        `If you get an error during cold start, please drop the database and run the command again.
         on mysql shell: DROP DATABASE #DB_NAME#;`,
      );

      await new Promise((resolve, reject) => {
        exec(`yarn run db:migration:run`, async (error, stdout, stderr) => {
          if (error) {
            reject(`Error: ${stderr}`);
          } else {
            resolve(stdout);
          }
        });
      });

      console.log('Database tables created!');
    }

    await connection.end();
  }
}
