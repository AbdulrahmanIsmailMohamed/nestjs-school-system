import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { catchError } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) /*: Promise<Partial<User>>*/ {
    const user = await this.userRepository.save(
      this.userRepository.create(createUserDto),
    );
    if (!user) throw new BadRequestException();
    return this.removeSensitiveUserFields(user);
  }

  /**
   * @access User
   */
  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        country: true,
        city: true,
        profileImage: true,
        profileImages: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`${userId} not found`);
    }

    return user;
  }

  /**
   * @access User
   */
  async getUsers(
    paginationDto: PaginationDto,
    keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.paginate(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  private async paginate(paginationDto: PaginationDto, keyword: string) {
    const { limit, page } = paginationDto;

    const skip = (page - 1) * limit;
    const endIndex: number = page * limit;

    let filters = {};
    if (keyword) filters = { username: Like(`${keyword}`), active: true };

    console.log(filters);

    const users = await this.userRepository.find({
      where: filters,
      skip: skip,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        country: true,
        city: true,
        profileImage: true,
        profileImages: true,
      },
    });
    if (!users) throw new NotFoundException();

    const countDocumnet = await this.userRepository.count({
      where: filters,
    });

    const paginationResult: PaginationResult = {
      data: users,
      page,
      limit,
    };
    if (endIndex < countDocumnet) paginationResult.nextPage = page + 1;
    if (skip > 0) paginationResult.previousPage = page - 1;

    return paginationResult;
  }

  private removeSensitiveUserFields(user: any): Partial<User> {
    const userSenitize: Partial<User> = {
      username: user.username,
      email: user.email,
      country: user.country,
    };

    return userSenitize;
  }
}
