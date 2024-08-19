import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  public async findById(id: number): Promise<User | null> {
    const query = `
    SELECT 
      name,
      surname,
      email,
      phone,
      age,
      country,
      district,
      role
    FROM users WHERE id = ?`;
    const result = await this.query(query, [id]);
    return result[0] || null;
  }

  public async store(user: UserCreateDto): Promise<User> {
    const newUser = this.create(user);
    return this.save(newUser);
  }

  public async updateOne(
    id: number,
    updateUserDto: UserUpdateDto,
  ): Promise<User | undefined> {
    const setClause = Object.keys(updateUserDto)
      .map((key) => `${key} = ?`)
      .join(', ');

    const query = `UPDATE users SET ${setClause}, updatedAt = NOW() WHERE id = ?`;
    const result = await this.query(query, [
      ...Object.values(updateUserDto),
      id,
    ]);

    if (result.affectedRows > 0) {
      return this.findById(id);
    }
    return undefined;
  }

  public async findAllWithPaginationAndSearch(
    page: number,
    pageSize: number,
    search: string,
  ): Promise<{
    data: User[];
    meta: { total: number; currentPage: number; pageSize: number };
  }> {
    const pageNum = parseInt(page.toString(), 10);
    const size = parseInt(pageSize.toString(), 10);

    const offset = (pageNum - 1) * size;

    let searchCondition = '';
    const searchParams: string[] = [];

    if (search) {
      searchCondition = `
     WHERE name LIKE ? 
     OR surname LIKE ? 
     OR email LIKE ? 
     OR phone LIKE ? 
     OR country LIKE ? 
     OR district LIKE ? 
     OR role LIKE ?
   `;
      const searchPattern = `%${search}%`;
      searchParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      );
    }

    const countQuery = `
   SELECT COUNT(*) AS total
   FROM users
   ${searchCondition}
 `;

    const dataQuery = `
    SELECT 
     users.id,
     users.name,
     users.surname,
     users.email,
     users.phone,
     users.age,
     users.country,
     users.district,
     users.role,
     users.createdAt,
     users.updatedAt
    FROM users
   ${searchCondition}
   LIMIT ? OFFSET ?
 `;

    const [totalResult, dataResult] = await Promise.all([
      this.query(countQuery, searchParams),
      this.query(dataQuery, [...searchParams, size, offset]) as Promise<User[]>,
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      data: dataResult,
      meta: {
        total,
        currentPage: pageNum,
        pageSize: size,
      },
    };
  }
}
