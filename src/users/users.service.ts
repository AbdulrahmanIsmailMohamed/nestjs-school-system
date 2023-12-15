import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { UpdateLoggedUserDto } from './dtos';
import { v2 as cloudinary } from 'cloudinary';
import { Pagination } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private pagination: Pagination,
  ) {}

  /**
   * @access manager, student, teacher, parent
   */
  async getMe(userId: number): Promise<Partial<User>> {
    console.log(userId);

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
      where: { id: userId, active: true, confirm: true },
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
    userId: number,
  ): Promise<PaginationResult> {
    const proginationResult = await this.pagination.paginate(
      paginationDto,
      keyword,
      userId,
    );
    if (!proginationResult) throw new NotFoundException();

    return proginationResult;
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
