import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/users.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Crypt } from 'src/utils';
import { EmailConfirmCodeDto } from './dtos/email-confirm-code.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private crypt;
    private readonly mailerService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, crypt: Crypt, mailerService: MailerService);
    register(registerDto: RegisterDto): Promise<string>;
    login(loginDto: LoginDto): Promise<string>;
    verifyEmailConfirmCode(emailConfirmCodeDto: EmailConfirmCodeDto): Promise<string>;
    private confirmEmail;
    private handleMailSendError;
    private generateAccessToken;
    private updateUserData;
    private hashCode;
}
