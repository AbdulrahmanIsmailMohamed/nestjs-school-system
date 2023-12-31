import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from './decorators';
import { RegisterDto } from './dtos/register.dto';
import { EmailConfirmCodeDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    const user = await this.authService.register(registerDto);
    if (!user) throw new BadRequestException();

    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/confirm-code')
  async vrerifyEmailConfirmCode(
    @Body() emailConfirmCodeDto: EmailConfirmCodeDto,
  ) {
    const user =
      await this.authService.verifyEmailConfirmCode(emailConfirmCodeDto);
    if (!user) throw new BadRequestException();

    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    if (!user) throw new BadRequestException();

    return user;
  }
}
