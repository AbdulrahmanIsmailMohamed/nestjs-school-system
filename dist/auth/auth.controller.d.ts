import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { EmailConfirmCodeDto } from './dtos';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<string>;
    vrerifyEmailConfirmCode(emailConfirmCodeDto: EmailConfirmCodeDto): Promise<string>;
    login(loginDto: LoginDto): Promise<string>;
}
