import { IsOptional, IsInt, IsString } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  lastId?: number;
}
