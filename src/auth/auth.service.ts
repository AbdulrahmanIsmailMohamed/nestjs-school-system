import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/users.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Crypt, generateRandomCode } from 'src/utils';
import { createHash } from 'crypto';
import { EmailConfirmCodeDto } from './dtos/email-confirm-code.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private crypt: Crypt,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<string> {
    const { password, email, username } = registerDto;

    const isEmailUserExist = await this.userRepository.findOneBy({
      email,
      confirm: true,
    });

    if (isEmailUserExist) {
      throw new BadRequestException(
        `The email ${email} is already in use. Please log in.`,
      );
    }

    const user = await this.userRepository.findOneBy({ username });

    if (!user || !this.crypt.compare(password, user.password)) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    if (user.ban === false) {
      if (user.limit < 4) {
        this.updateUserData(user, registerDto);
        return await this.confirmEmail(user);
      } else {
        user.ban = true;
        user.banDate = (Date.now() + 1000 * 60 * 60 * 24).toString();
        user.limit = 0;
        await user.save();
        throw new BadRequestException(
          `Too much request please register after ${new Date(
            parseInt(user.banDate),
          ).getHours()} hours`,
        );
      }
    } else {
      if (parseInt(user.banDate) < Date.now()) {
        user.ban = false;
        user.banDate = undefined;
        await user.save();
        this.updateUserData(user, registerDto);
        return await this.confirmEmail(user);
      } else {
        throw new BadRequestException(
          `Too much request please register after ${new Date(
            parseInt(user.banDate),
          ).getHours()} hours`,
        );
      }
    }
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email, confirm: true });

    if (!user || !this.crypt.compare(password, user.newPassword)) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    return await this.generateAccessToken(user);
  }

  async verifyEmailConfirmCode(emailConfirmCodeDto: EmailConfirmCodeDto) {
    const { email, confirmCode } = emailConfirmCodeDto;

    const user = await this.userRepository.findOneBy({
      email,
      emailConfirmCode: this.hashCode(confirmCode),
      emailConfirmCodeExpire: MoreThan(Date.now().toString()),
      confirm: false,
      active: true,
      ban: false,
    });
    if (!user) throw new BadRequestException(`Invalid email or confirm code`);

    user.confirm = true;
    user.emailConfirmCode = undefined;
    user.emailConfirmCodeExpire = undefined;
    await user.save();

    return `Your email confirmed successfully, now you can login`;
  }

  private async confirmEmail(user: User): Promise<string> {
    const confirmCode = generateRandomCode();
    user.emailConfirmCode = this.hashCode(confirmCode);
    user.emailConfirmCodeExpire = (Date.now() + 1000 * 60 * 10).toString(); // expire after 10 minutes
    user.limit += 1;
    await user.save();

    const message = `
      <h2>Hi ${user.name}</h2>
      <p>We received a request to confirm the email on your school system Account.</p>
      <h3>${confirmCode}</h3>
      <p>Enter this code to complete the confirm</p>
      <p>Thanks for helping us keep your account secure</p>
      <p>The School System Team</p>
    `;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        html: message,
        subject: 'Your Email Confirm Code (Valid For 10 Minutes)',
      });
    } catch (error) {
      await this.handleMailSendError(user);
    }

    return 'The confirmation code has been sent via email';
  }

  private async handleMailSendError(user: User): Promise<void> {
    user.emailConfirmCode = undefined;
    user.emailConfirmCodeExpire = undefined;
    await user.save();

    throw new InternalServerErrorException(
      'Failed to send confirmation email.',
    );
  }

  private async generateAccessToken(user: User): Promise<string> {
    const { id, username, role } = user;

    return this.jwtService.signAsync({
      id,
      username,
      role,
    });
  }

  private updateUserData(user: User, registerDto: RegisterDto): void {
    const { email, newPassword, city, country } = registerDto;

    const hashNewPassword = this.crypt.hash(newPassword);

    user.email = email;
    user.newPassword = hashNewPassword;
    user.country = country;
    user.city = city;
  }

  private hashCode(resetCode: string): string {
    return createHash('sha256').update(resetCode).digest('hex');
  }
}
