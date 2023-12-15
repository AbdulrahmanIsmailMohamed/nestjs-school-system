import { User } from 'src/users/entities/users.entity';
import { BaseEntity } from 'typeorm';
export declare class Student extends BaseEntity {
    id: number;
    name: string;
    contactNumber: string;
    imageProfile: string;
    user: User;
}
