import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/common/enums/role.enum';
import { PaginationDto } from './dtos';
import { AuthenticatedRequest, PaginationResult } from './interfaces';
import { UpdateLoggedUserDto } from './dtos/update-logged-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER)
  @Get()
  async getUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginationResult> {
    const users = await this.userService.getUsers(
      paginationDto,
      keyword,
      req.user.id,
    );
    if (!users) throw new NotFoundException();

    return users;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest): Promise<Partial<User>> {
    const user = await this.userService.getUser(req.user.id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @UseInterceptors(FileInterceptor('profileImage'))
  @Patch('me')
  async updateLoggedUser(
    @Request() req: AuthenticatedRequest,
    @Body() updateLoggedUserDto: UpdateLoggedUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) /*: Promise<string | User>*/ {
    const user = await this.userService.updateLoggedUser(
      req.user.id,
      updateLoggedUserDto,
      profileImage,
    );

    if (!user) throw new BadRequestException();

    return user;
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
