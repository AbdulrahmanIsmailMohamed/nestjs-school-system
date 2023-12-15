/// <reference types="multer" />
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { PaginationDto } from './dtos';
import { AuthenticatedRequest, PaginationResult } from './interfaces';
import { UpdateLoggedUserDto } from './dtos/update-logged-user.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(paginationDto: PaginationDto, keyword: string, req: AuthenticatedRequest): Promise<PaginationResult>;
    getMe(req: AuthenticatedRequest): Promise<Partial<User>>;
    updateLoggedUser(req: AuthenticatedRequest, updateLoggedUserDto: UpdateLoggedUserDto, profileImage: Express.Multer.File): Promise<Partial<User> | "Done">;
    getUser(id: number): Promise<User>;
}
