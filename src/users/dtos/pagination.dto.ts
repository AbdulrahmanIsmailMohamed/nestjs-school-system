import { IsNotEmpty, IsNumber } from 'class-validator';
import { TransformInt } from '../decorators';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @TransformInt()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @TransformInt()
  limit: number;
}
