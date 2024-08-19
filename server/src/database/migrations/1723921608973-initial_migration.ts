import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class InitialMigration1723921608973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        surname VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(255),
        age INT,
        country VARCHAR(255),
        district VARCHAR(255),
        role VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    const users = [];

    for (let i = 0; i < 20; i++) {
      users.push([
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        bcrypt.hashSync(faker.internet.password(), 12),
        faker.phone.number(),
        faker.number.int({ min: 18, max: 80 }),
        faker.location.country(),
        faker.location.city(),
        faker.helpers.arrayElement(['user', 'admin', 'moderator']),
        faker.date.past().toISOString().slice(0, 19).replace('T', ' '),
        faker.date.recent().toISOString().slice(0, 19).replace('T', ' '),
      ]);
    }

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO users (name, surname, email, password, phone, age, country, district, role, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        user,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users`);
  }
}
