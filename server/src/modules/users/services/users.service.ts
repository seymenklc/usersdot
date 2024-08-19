import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { GetUsersDto } from '../dtos/users.get.dto';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async findWithPaginationAndSearch(query: GetUsersDto) {
    const { page = 1, pageSize = 20, search = '' } = query;
    try {
      const result = await this.userRepository.findAllWithPaginationAndSearch(
        page,
        pageSize,
        search,
      );

      return result;
    } catch (error) {
      this.logger.log(
        `UsersService:findWithPaginationAndSearch: ${JSON.stringify(error.message)}`,
      );
      throw new Error('Something went wrong, Please try again later');
    }
  }

  async create(user: UserCreateDto): Promise<User> {
    try {
      return this.userRepository.store(user);
    } catch (error) {
      this.logger.log(`UsersService:create: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    } catch (error) {
      this.logger.log(
        `UsersService:findById: ${JSON.stringify(error.message)}`,
      );
      throw new Error(error.message);
    }
  }

  async update(id: number, user: UserUpdateDto): Promise<User> {
    try {
      await this.findById(id);
      return await this.userRepository.updateOne(id, user);
    } catch (error) {
      this.logger.log(`UsersService:update: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }
}
