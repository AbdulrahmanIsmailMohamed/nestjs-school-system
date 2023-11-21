import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = await this.authService.register(createUserDto);
    if (!user) throw new BadRequestException();

    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    console.log('gi');

    const user = await this.authService.login(loginDto);
    if (!user) throw new BadRequestException();

    return user;
  }
}
