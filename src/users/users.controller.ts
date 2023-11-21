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
import { CreateUserManagerDto } from './dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserManagerDto: CreateUserManagerDto,
  ): Promise<Partial<User>> {
    console.log(createUserManagerDto);

    const user = await this.userService.createUser(createUserManagerDto);
    if (!user) throw new BadRequestException(`occur error while save user`);
    return user;
  }

  @Get('me')
  async getMe(@Request() req): Promise<User> {
    console.log(req.user);

    return await this.userService.getUser(req.user.id);
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
  @Roles(Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getUser(id);
    if (!user) throw new NotFoundException();

    return user;
  }
}
