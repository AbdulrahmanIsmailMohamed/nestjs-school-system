import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crypt } from '../utils/hashPassword';
import { generateRandomCode } from 'src/utils';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private crypt: Crypt,
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
