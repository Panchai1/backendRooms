import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            secretOrKey: process.env.JWT_ACCESS_SECRET as string,   // การเช็คว่า token นี้ถูกสรา้งจากJWT_ACCESS_SECRET จริงมั้ย
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.username,role: payload.role, };
    }
}    // username
