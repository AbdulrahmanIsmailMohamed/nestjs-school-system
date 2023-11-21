import { compareSync, hashSync } from 'bcrypt';

export class Crypt {
  hash(passowrd: string): string {
    return hashSync(passowrd, 10);
  }
  compare(password: string, userPassword: string): boolean {
    return compareSync(password, userPassword);
  }
}
