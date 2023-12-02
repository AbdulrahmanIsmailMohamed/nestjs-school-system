import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Crypt, Pagination } from 'src/utils';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: multer.diskStorage({
          filename(req, file, callback) {
            callback(null, file.originalname);
          },
        }),
        fileFilter: (req: any, file: any, cb: any) => {
          if (
            file.mimetype.startsWith('image') ||
            file.mimetype.startsWith('video') ||
            file.mimetype.startsWith('application/pdf')
          )
            cb(null, true);
          else cb(new BadRequestException('Only images or videos'), null);
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, Crypt, Pagination],
})
export class UsersModule {}
