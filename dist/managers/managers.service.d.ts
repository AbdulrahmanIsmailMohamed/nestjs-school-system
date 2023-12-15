import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Crypt } from '../utils/hashPassword';
import { Pagination } from 'src/utils';
import { PaginationDto } from 'src/users/dtos';
export declare class ManagersService {
    private userRepository;
    private crypt;
    private pagination;
    constructor(userRepository: Repository<User>, crypt: Crypt, pagination: Pagination);
    createUser(createUserDto: CreateUserDto): Promise<Partial<User>>;
    updateRoleOfUser(userId: number, role: any): Promise<string>;
    deleteUser(userId: number): Promise<string>;
    getInactiveUsers(paginationDto: PaginationDto, keyword: string, userId: number): Promise<import("../users/interfaces").PaginationResult>;
    getUnconfirmedUsers(paginationDto: PaginationDto, keyword: string, userId: number): Promise<import("../users/interfaces").PaginationResult[]>;
    inactiveOrActiveUser(userId: number): Promise<string>;
    private removeSensitiveUserFields;
}
