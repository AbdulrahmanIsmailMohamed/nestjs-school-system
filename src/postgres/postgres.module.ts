import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('DB_URL'),
        type: 'postgres',
        // host: configService.get<string>('DB_HOST'),
        // port: configService.get('DB_PORT'),
        // username: configService.get<string>('DB_USERNAME'),
        // password: configService.get<string>('DB_PASSWORD'),
        // database: configService.get<string>('DB_DATABASE'),
        entities: [User, Student],
        synchronize: true,
        ssl: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
