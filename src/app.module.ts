import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    UsersModule,
  ],
})
export class AppModule {}
