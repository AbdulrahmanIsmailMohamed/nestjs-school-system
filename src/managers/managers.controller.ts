import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
  Param,
  BadRequestException,
  Delete,
  NotFoundException,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/auth/guards';
import { UpdateRoleOfUserDto } from './dto';
import { AuthenticatedRequest } from 'src/users/interfaces';
import { PaginationDto } from 'src/users/dtos';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @Post()
  createUser(@Body() createManagerDto: CreateUserDto) {
    return this.managersService.createUser(createManagerDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getInactiveUsers(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.managersService.getInactiveUsers(
      paginationDto,
      keyword,
      req.user.id,
    );
    if (!data) throw new BadRequestException();

    return data;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async inactiveUser(@Param('id') id: number): Promise<string> {
    const user = await this.managersService.inactiveUser(id);
    if (!user) throw new BadRequestException();

    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<string> {
    const user = await this.managersService.deleteUser(id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateRoleOfUser(
    @Param('id') id: number,
    @Body() role: UpdateRoleOfUserDto,
  ): Promise<string> {
    const user = await this.managersService.updateRoleOfUser(id, role);
    if (!user) throw new NotFoundException();

    return user;
  }
}
