import { ManagersService } from './managers.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleOfUserDto } from './dto';
import { AuthenticatedRequest } from 'src/users/interfaces';
import { PaginationDto } from 'src/users/dtos';
export declare class ManagersController {
    private readonly managersService;
    constructor(managersService: ManagersService);
    createUser(createManagerDto: CreateUserDto): Promise<Partial<import("../users/entities/users.entity").User>>;
    getUnconfirmedUsers(paginationDto: PaginationDto, keyword: string, req: AuthenticatedRequest): Promise<import("src/users/interfaces").PaginationResult[]>;
    getInactiveUsers(paginationDto: PaginationDto, keyword: string, req: AuthenticatedRequest): Promise<import("src/users/interfaces").PaginationResult>;
    deleteUser(id: number): Promise<string>;
    updateRoleOfUser(id: number, role: UpdateRoleOfUserDto): Promise<string>;
    inactiveOrActiveUser(id: number): Promise<string>;
}
