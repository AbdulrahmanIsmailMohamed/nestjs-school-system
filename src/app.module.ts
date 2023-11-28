import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';
import { v2 } from 'cloudinary';
import { ManagersModule } from './managers/managers.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
dotenv.config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport:
        'smtps://programabdulrahman@gmail.com:zibkozvfjaahgsqy@smtp.gmail.com',
      defaults: {
        from: '"School System" <modules@nestjs.com>',
      },
      // template: {
      //   dir: __dirname + '/templates',
      //   adapter: new PugAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    UsersModule,
    AuthModule,
    StudentsModule,
    TeachersModule,
    ClassesModule,
    ManagersModule,
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
