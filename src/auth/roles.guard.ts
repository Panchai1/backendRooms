import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // ดึง role ที่กำหนดไว้ใน @Roles()
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // ถ้า route นี้ไม่ได้กำหนด role → เข้าได้เลย
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ถ้าไม่มี user (เช่น JWT ไม่ทำงาน)
    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // ถ้า role ไม่ตรง
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true; // ผ่าน
  }
}
