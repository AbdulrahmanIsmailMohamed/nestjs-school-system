import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crypt } from '../utils/hashPassword';
import { Pagination, generateRandomCode } from 'src/utils';
import { PaginationDto } from 'src/users/dtos';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private crypt: Crypt,
    private pagination: Pagination,
  ) {}

  /**
   * @access Manager
   */
  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    let { password, username } = createUserDto;

    if (!username || !password) {
      username = generateRandomCode();
      password = generateRandomCode();
    }

    // Check if username already exist
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const hashPassword = this.crypt.hash(password);
    delete createUserDto.password;

    const user = await this.userRepository.save(
      this.userRepository.create({
        name: createUserDto.name,
        username,
        role: createUserDto.role,
        password: hashPassword,
      }),
    );
    if (!user) throw new BadRequestException();

    return this.removeSensitiveUserFields(user);
  }

  /**
   * @access Manager
   */
  async updateRoleOfUser(userId: number, role: any): Promise<string> {
    const user = await this.userRepository.update(
      { id: userId, confirm: true },
      role,
    );
    if (user.affected === 0) throw new NotFoundException();

    return 'Done';
  }

  /**
   * @access Manager
   */
  async deleteUser(userId: number): Promise<string> {
    const user = await this.userRepository.delete({ id: userId });
    if (user.affected === 0) throw new NotFoundException();

    return 'done';
  }

  async getInactiveUsers(
    paginationDto: PaginationDto,
    keyword: string,
    userId: number,
  ) {
    const paginationResult = await this.pagination.paginate(
      paginationDto,
      keyword,
      userId,
      false,
    );
    if (!paginationResult.data)
      throw new BadRequestException(`Not found inactive users`);

    return paginationResult;
  }

  async getUnconfirmedUsers(
    paginationDto: PaginationDto,
    keyword: string,
    userId: number,
  ) {
    const paginationResult = await this.pagination.paginate(
      paginationDto,
      keyword,
      userId,
      true,
      false,
    );
    if (!paginationResult.data)
      throw new BadRequestException(`Not found Unconfirmed users`);

    return [paginationResult];
  }

  async inactiveUser(userId: number): Promise<string> {
    const user = await this.userRepository.update(
      { id: userId },
      { active: false },
    );
    if (user.affected === 0) throw new NotFoundException();

    return 'Done';
  }

  private removeSensitiveUserFields(user: any): Partial<User> {
    const userSenitize: Partial<User> = {
      id: user.id,
      username: user.username,
      email: user.email,
      country: user.country,
      city: user.city,
      profileImage: user.profileImage,
      profileImages: user.profileImages,
    };

    return userSenitize;
  }
}
