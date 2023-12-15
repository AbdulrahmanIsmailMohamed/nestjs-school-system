/// <reference types="multer" />
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { UpdateLoggedUserDto } from './dtos';
import { Pagination } from 'src/utils';
export declare class UsersService {
    private readonly userRepository;
    private pagination;
    constructor(userRepository: Repository<User>, pagination: Pagination);
    getMe(userId: number): Promise<Partial<User>>;
    getUser(userId: number): Promise<User>;
    getUsers(paginationDto: PaginationDto, keyword: string, userId: number): Promise<PaginationResult>;
    updateLoggedUser(userId: number, updateLoggedUserDto: UpdateLoggedUserDto, profileImage: Express.Multer.File): Promise<Partial<User> | 'Done'>;
    private removeSensitiveUserFields;
    private uploadProfileImage;
}
