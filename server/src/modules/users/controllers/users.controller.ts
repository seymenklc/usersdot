import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Response as ResponseType } from '../../../util/enums/response.enum';
import { IdParamValidation } from '../../../util/decorators/id-param-validation.decorator';
import { GetUsersDto } from '../dtos/users.get.dto';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import type { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  public async findAll(@Res() response: Response, @Query() query: GetUsersDto) {
    try {
      const users = await this.usersService.findWithPaginationAndSearch(query);

      return response.status(HttpStatus.OK).json({
        type: ResponseType.SUCCESS,
        message: null,
        result: users,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: 'Something went wrong, Please try again later',
        result: null,
      });
    }
  }

  @Get('/:id')
  public async getById(
    @Res() response: Response,
    @Param() { id }: IdParamValidation,
  ) {
    try {
      const user = await this.usersService.findById(id);
      return response.status(HttpStatus.OK).json({
        type: ResponseType.SUCCESS,
        message: null,
        result: user,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: 'Something went wrong, Please try again later',
        result: null,
      });
    }
  }

  @Post()
  public async create(
    @Res() response: Response,
    @Body() userCreateDto: UserCreateDto,
  ) {
    try {
      const user = await this.usersService.create(userCreateDto);

      return response.status(HttpStatus.CREATED).json({
        type: ResponseType.SUCCESS,
        message: 'User has been created successfully',
        result: user,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: 'Something went wrong, Please try again later',
        result: null,
      });
    }
  }

  @Put('/:id')
  public async update(
    @Res() response: Response,
    @Param() { id }: IdParamValidation,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    try {
      const user = await this.usersService.update(id, userUpdateDto);
      return response.status(HttpStatus.OK).json({
        type: ResponseType.SUCCESS,
        message: 'User has been updated successfully',
        result: user,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        type: ResponseType.ERROR,
        message: 'Something went wrong, Please try again later',
        result: null,
      });
    }
  }
}
