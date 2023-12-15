import { PaginationDto } from 'src/users/dtos';
import { User } from 'src/users/entities/users.entity';
import { PaginationResult } from 'src/users/interfaces';
import { Repository } from 'typeorm';
export declare class Pagination {
    private userRepository;
    constructor(userRepository: Repository<User>);
    paginate(paginationDto: PaginationDto, keyword: string, userId: number, active?: boolean, confirm?: boolean): Promise<PaginationResult>;
}
