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
import { UpdateLoggedUserDto } from './dtos';
import { Filters } from './interfaces';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private crypt: Crypt,
  ) {}

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
  ): Promise<Partial<User> | 'Done'> {
    if (profileImage) {
      return await this.uploadProfileImage(
        userId,
        profileImage,
        updateLoggedUserDto,
      );
    }

    const result = await this.userRepository.update(
      { id: userId },
      updateLoggedUserDto,
    );

    if (result.affected === 0) {
      throw new BadRequestException();
    }

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

  private async uploadProfileImage(
    userId: number,
    profileImage: Express.Multer.File,
    updateLoggedUserDto: UpdateLoggedUserDto,
  ): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        country: true,
        city: true,
        profileImage: true,
        profileImages: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const { url } = await cloudinary.uploader.upload(profileImage.path, {
      folder: 'school_system/profiles_Images',
      format: 'jpg',
      public_id: `${Date.now()}-profile`,
    });

    user.country = updateLoggedUserDto.country;
    user.city = updateLoggedUserDto.city;
    user.profileImage = url;

    // Initialize profileImages as an empty array if it's null
    user.profileImages = user.profileImages || [];
    user.profileImages.push(url);

    await user.save();
    return this.removeSensitiveUserFields(user);
  }
}
