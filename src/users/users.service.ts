import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Like, Not, Repository } from 'typeorm';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { Crypt } from 'src/utils';
import { CreateUserDto, UpdateLoggedUserDto } from './dtos';
import { Filters } from './interfaces';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private crypt: Crypt,
  ) {}

  /**
   * @access Manager, Teacher
   */
  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { password, username, email } = createUserDto;

    // Check if username or email already exist
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException('Email or username already exists');
    }

    const hashPassword = this.crypt.hash(password);
    delete createUserDto.password;

    const user = await this.userRepository.save(
      this.userRepository.create({
        password: hashPassword,
        ...createUserDto,
      }),
    );
    if (!user) throw new BadRequestException();

    return this.removeSensitiveUserFields(user);
  }

  /**
   * @access manager, student, teacher
   */
  async getMe(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`${userId} not found`);
    }

    return this.removeSensitiveUserFields(user);
  }

  /**
   * @access manager, student, teacher
   */
  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: Not('manager') },
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
   * @access Manager Teacher
   */
  async getUsers(
    paginationDto: PaginationDto,
    keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.paginate(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  async updateLoggedUser(
    userId: number,
    updateLoggedUserDto: UpdateLoggedUserDto,
    profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      const { url } = await cloudinary.uploader.upload(profileImage.path, {
        folder: 'school_system/profiles_Images',
        format: 'jpg',
        public_id: `${Date.now()}-profile`,
      });
      console.log(url);
      updateLoggedUserDto.profileImage = url;
    }

    const user = await this.userRepository.update(
      { id: userId },
      updateLoggedUserDto,
    );
    if (user.affected === 0) throw new BadRequestException();

    return 'Done';
  }

  /**
   * @access Manager
   */
  async updateRoleOfUser(userId: number, role: any): Promise<string> {
    const user = await this.userRepository.update({ id: userId }, role);
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

  async inactiveUser(userId: number): Promise<string> {
    const user = await this.userRepository.update(
      { id: userId },
      { active: false },
    );
    if (user.affected === 0) throw new NotFoundException();

    return 'Done';
  }

  private async paginate(paginationDto: PaginationDto, keyword: string) {
    const { limit, page } = paginationDto;

    const skip = (page - 1) * limit;
    const endIndex: number = page * limit;

    const filters: Filters = { active: true, role: Not('manager') };
    if (keyword) filters.username = Like(`${keyword}`);

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
