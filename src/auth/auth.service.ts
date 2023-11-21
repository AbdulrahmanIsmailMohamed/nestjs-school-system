import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Crypt } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private crypt: Crypt,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<string> {
    const { password, email } = createUserDto;

    const isEmailUserExist = await this.userRepository.findOneBy({ email });
    if (isEmailUserExist) {
      throw new BadRequestException(
        `Your ${email} is already exist, please login`,
      );
    }

    const hashPassword = this.crypt.hash(password);
    delete createUserDto.password;

    const user = await this.userRepository.save(
      this.userRepository.create({ password: hashPassword, ...createUserDto }),
    );
    if (!user) throw new BadRequestException();

    return await this.accessToken(user);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email });
    console.log(user);

    if (!user || !this.crypt.compare(password, user.password)) {
      throw new UnauthorizedException();
    }

    return await this.accessToken(user);
  }

  private accessToken(user: any): Promise<string> {
    const { id, username, role } = user;

    const token = this.jwtService.signAsync({
      id,
      username,
      role,
    });

    return token;
  }
}
