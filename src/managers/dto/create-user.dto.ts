import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6)
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(6, 10)
  username: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(6, 6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsEnum({ student: Role.STUDENT, teacher: Role.TEACHER, parent: Role.PARENT })
  role: string[];
}
