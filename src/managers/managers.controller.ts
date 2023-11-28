import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/auth/guards';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @Post()
  createUser(@Body() createManagerDto: CreateUserDto) {
    return this.managersService.createUser(createManagerDto);
  }
}
