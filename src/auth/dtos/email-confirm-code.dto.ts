import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class EmailConfirmCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  confirmCode: string;
}
