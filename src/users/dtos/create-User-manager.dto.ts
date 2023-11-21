import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserManagerDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  // @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? 'user' : value))
  // @IsEnum({
  //   manager: Role.MANAGER,
  //   teacher: Role.TEACHER,
  //   student: Role.STUDENT,
  //   guardian: Role.GUARDIAN,
  // })
  role: string;
}
