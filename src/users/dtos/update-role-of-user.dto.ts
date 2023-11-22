import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateRoleOfUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum({
    manager: Role.MANAGER,
    teacher: Role.TEACHER,
    student: Role.STUDENT,
    guardian: Role.GUARDIAN,
  })
  role: string;
}
