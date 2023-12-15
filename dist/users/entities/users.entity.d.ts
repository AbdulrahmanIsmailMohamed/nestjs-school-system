import { Student } from 'src/students/entities/student.entity';
import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    email: string;
    name: string;
    username: string;
    password: string;
    newPassword: string;
    emailConfirmCodeExpire: string;
    emailConfirmCode: string;
    passwordResetCode: string;
    passwordResetCodeExpire: string;
    passwordResetVerified: boolean;
    role: Array<string>;
    ban: boolean;
    confirm: boolean;
    banDate: string;
    limit: number;
    country: string;
    city: string;
    profileImage: string;
    profileImages: Array<string>;
    active: boolean;
    favourites: Array<string>;
    student: Student;
}
