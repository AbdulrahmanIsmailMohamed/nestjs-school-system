import { User } from '../entities/users.entity';
export interface PaginationResult {
    data: User[];
    page: number;
    limit: number;
    countDocument: number;
    previousPage?: number;
    nextPage?: number;
}
