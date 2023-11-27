import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';
import { v2 } from 'cloudinary';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { StudentModule } from './student/student.module';
import { StudentsModule } from './students/students.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    StudentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: 'Cloudinary',
      useFactory: () =>
        v2.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET,
        }),
    },
  ],
})
export class AppModule {}
