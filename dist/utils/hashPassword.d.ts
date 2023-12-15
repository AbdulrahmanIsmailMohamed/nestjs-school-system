export declare class Crypt {
    hash(passowrd: string): string;
    compare(password: string, userPassword: string): boolean;
}
