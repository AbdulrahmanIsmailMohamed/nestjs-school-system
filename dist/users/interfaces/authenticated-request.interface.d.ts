import { User } from '../entities/users.entity';
export interface AuthenticatedRequest extends Body {
    user: User;
}
