import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ✅ แก้จุดที่ 1: ใช้ Type Assertion 'as string' เพื่อยืนยันว่ามีค่าแน่นอน
      secretOrKey: process.env.JWT_REFRESH_SECRET as string, 
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // ✅ แก้จุดที่ 2: เช็คก่อนว่า Header มีค่าไหมก่อนจะสั่ง .replace()
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token not found in header');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}