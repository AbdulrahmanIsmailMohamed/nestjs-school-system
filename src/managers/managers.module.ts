import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { Crypt, Pagination } from 'src/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ManagersController],
  providers: [ManagersService, Crypt, Pagination],
})
export class ManagersModule {}
