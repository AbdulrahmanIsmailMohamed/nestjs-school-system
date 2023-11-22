import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateLoggedUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  profileImage: string;
}
