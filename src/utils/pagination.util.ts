import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/users/dtos';
import { User } from 'src/users/entities/users.entity';
import { Filters, PaginationResult } from 'src/users/interfaces';
import { Not, Repository } from 'typeorm';

export class Pagination {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async paginate(
    paginationDto: PaginationDto,
    keyword: string,
    userId: number,
    active: boolean = true,
    confirm: boolean = true,
  ) {
    const { limit, page } = paginationDto;

    const skip = (page - 1) * limit;
    const endIndex: number = page * limit;

    const filters: Filters = {
      id: Not(userId),
      active,
      role: Not('manager'),
      confirm,
    };
    const query = this.userRepository.createQueryBuilder('user');
    if (keyword) {
      query.andWhere(
        '(user.username LIKE :keyword OR user.name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const users = await query
      .andWhere(filters)
      .skip(skip)
      .take(limit)
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.email',
        'user.country',
        'user.city',
        'user.profileImage',
        'user.profileImages',
      ])
      .getMany();

    if (!users) throw new NotFoundException();

    const countDocumnet = await query
      .andWhere(filters)
      .skip(skip)
      .take(limit)
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.email',
        'user.country',
        'user.city',
        'user.profileImage',
        'user.profileImages',
      ])
      .getCount();

    const paginationResult: PaginationResult = {
      data: users,
      page,
      limit,
    };
    if (endIndex < countDocumnet) paginationResult.nextPage = page + 1;
    if (skip > 0) paginationResult.previousPage = page - 1;

    return paginationResult;
  }
}
