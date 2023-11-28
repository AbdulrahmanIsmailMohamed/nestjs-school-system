import crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Crypt, generateRandomCode } from 'src/utils';
import { RegisterDto } from './dtos/register.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private crypt: Crypt,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, email, username } = registerDto;

    const isEmailUserExist = await this.userRepository.findOneBy({
      email,
      confirm: true,
    });
    if (isEmailUserExist) {
      throw new BadRequestException(
        `Your ${email} is already exist, please login`,
      );
    }

    const user = await this.userRepository.findOneBy({ username });
    if (!user || !this.crypt.compare(password, user.password)) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    await this.updateUserData(user, registerDto);

    await this.confirmEmail(user.email);
    //
    // return await this.accessToken(user);
    return 'done';
  }

  private async confirmEmail(email: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException(`Invalid email`);

    // Generate hash reset random 6 digits and save via db
    const confirmCode = generateRandomCode();
    user.emailConfirmCode = confirmCode; //this.hashCode(confirmCode);
    user.emailConfirmCodeExpire = 1252; //Date.now();
    await user.save();

    // send reset code via email by nodemailer
    const message = `
    <h2>Hi ${user.name}</h2>
    <p>We received a request to reset the password on your Social-Network Account.</p>
    <h3>${confirmCode}</h3>
    <p>Enter this code to complete the reset</p>
    <p>Thanks for helping us keep your account secure</p>
    <p>The Social-Network Team</p>
  `;
    try {
      await this.mailerService.sendMail({
        to: 'abdulrahman.ismail.mohammed@gmail.com',
        html: message,
        subject: 'Your Password Rest Code (Valid For 10 Minute)',
      });
    } catch (error) {
      user.emailConfirmCode = undefined;
      user.emailConfirmCodeExpire = undefined;
      await user.save();

      throw new InternalServerErrorException();
    }

    return 'The Reset Code send via email';
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email, confirm: true });
    if (!user || !this.crypt.compare(password, user.newPassword)) {
      throw new UnauthorizedException(`Invalid email or password`);
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

  private async updateUserData(
    user: User,
    registerDto: RegisterDto,
  ): Promise<void> {
    const { email, newPassword, city, country } = registerDto;

    const hashNewPassword = this.crypt.hash(newPassword);

    user.email = email;
    user.newPassword = hashNewPassword;
    user.country = country;
    user.city = city;
    await user.save();
  }

  hashCode(resetCode: string): string {
    const hashCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    return hashCode;
  }
}
