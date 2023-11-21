import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles);

    if (!roles) {
      return true; // No roles specified, so access is granted by default
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    console.log(user);
    if (!user || !user.role) {
      return false; // User not authenticated or doesn't have roles
    }
    console.log(user);

    return roles.some((role) => user.role.includes(role));
  }
}
