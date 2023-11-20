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
  //   UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/users.entity';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //   @UseGuards(RolesGuard)
  //   @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ) /*: Promise<Partial<User>>*/ {
    const user = await this.userService.createUser(createUserDto);
    if (!user) throw new BadRequestException(`occur error while save user`);
    return user;
  }

  @Get('me')
  async getMe(@Request() req): Promise<User> {
    console.log(req.user);

    return await this.userService.getUser(req.user.id);
  }

  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
  ): Promise<PaginationResult> {
    const users = await this.userService.getUsers(paginationDto, keyword);
    if (!users) throw new NotFoundException();

    return users;
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getUser(id);
    if (!user) throw new NotFoundException();

    return user;
  }
}
