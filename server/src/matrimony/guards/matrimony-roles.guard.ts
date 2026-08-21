import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MatrimonyUserRole } from '../schemas/matrimony-user.schema';

export const MATRIMONY_ROLES_KEY = 'matrimony_roles';

/** Decorator to specify required roles for a matrimony route */
export function MatrimonyRoles(...roles: MatrimonyUserRole[]) {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(MATRIMONY_ROLES_KEY, roles, descriptor.value);
    } else {
      Reflect.defineMetadata(MATRIMONY_ROLES_KEY, roles, target);
    }
    return descriptor || target;
  };
}

@Injectable()
export class MatrimonyRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach decoded user to request for downstream use
    request.matrimony_user = payload;

    // Get required roles from metadata
    const requiredRoles = this.reflector.get<MatrimonyUserRole[]>(
      MATRIMONY_ROLES_KEY,
      context.getHandler(),
    );

    // No roles required = any authenticated user can access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Normalize role: if legacy admin token (payload.isAdmin=true), map to super_admin
    const userRole = payload.role || (payload.isAdmin ? MatrimonyUserRole.SUPER_ADMIN : undefined);

    if (!requiredRoles.includes(userRole) && !payload.isAdmin) {
      throw new ForbiddenException(
        `This action requires one of: [${requiredRoles.join(', ')}]. Your role: ${userRole || 'none'}`,
      );
    }

    return true;
  }
}
