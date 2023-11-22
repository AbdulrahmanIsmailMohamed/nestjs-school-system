import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  //   UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from './dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {
    console.log(createUserDto);

    const user = await this.userService.createUser(createUserDto);
    if (!user) throw new BadRequestException(`occur error while save user`);
    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER)
  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.userService.getUsers(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUARDIAN)
  @Get('me')
  async getMe(@Request() req): Promise<Partial<User>> {
    const user = await this.userService.getMe(req.user.id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @Get(':id')
  async getUser(@Request() req, @Param('id') id: number): Promise<User> {
    const userId = id || req.user.id;

    const user = await this.userService.getUser(userId);
    if (!user) throw new NotFoundException();

    return user;
  }
}
