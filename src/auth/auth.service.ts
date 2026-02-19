import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: any,
    ) { }


    // ==========================
    // ✅ LOGIN (เพิ่มเก็บ refreshTokenHash ตรงนี้)
    // ==========================

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);

        // const payload = { sub: user._id, email: user.email };
        // 🔥 เพิ่ม role เข้าไปใน payload
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET as string,
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRATION),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET as string,
            expiresIn: Number(process.env.JWT_REFRESH_EXPIRATION),
        });

        // ✅ 🔥 เพิ่มตรงนี้ — hash refreshToken ก่อนเก็บ
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await this.userModel.updateOne(
            { _id: user._id },
            { refreshTokenHash },
        );


        return {
            accessToken,
            refreshToken,
        };
    }


    // ==========================
    // ✅ VALIDATE USER (ใช้ใน login)
    // ==========================


    async validateUser(email: string, password: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    // ==========================
    // ✅ REFRESH (เพิ่มตรวจ hash ตรงนี้)
    // ==========================
    async refresh(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET as string,
            });

            const user = await this.userModel.findById(payload.sub);

            if (!user || !user.refreshTokenHash) {
                throw new UnauthorizedException();
            }

            // ✅ 🔥 เพิ่มตรงนี้ — compare token กับ hash
            const isMatch = await bcrypt.compare(
                token,
                user.refreshTokenHash,
            );

            if (!isMatch) {
                throw new UnauthorizedException();
            }

            const newAccessToken = this.jwtService.sign(
                { sub: user._id, email: user.email, role: user.role },
                {
                    secret: process.env.JWT_ACCESS_SECRET as string,
                    expiresIn: Number(process.env.JWT_ACCESS_EXPIRATION),
                },
            );

            return { accessToken: newAccessToken };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

     //register เพิ่มใหม่ทั้งก้อน

    async register(dto: RegisterDto) {
        const existingUser = await this.userModel.findOne({
            email: dto.email,
        });

        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.userModel.create({
            email: dto.email,
            passwordHash: passwordHash,
            role: 'user',
        });

        return {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        };
    }

    // ==========================
    // ✅ LOGOUT (เพิ่มใหม่ทั้งก้อน)
    // ==========================
    async logout(userId: string) {
        // 🔥 ลบ refreshTokenHash ออกจาก DB
        await this.userModel.updateOne(
            { _id: userId },
            { refreshTokenHash: null },
        );

        return { message: 'Logged out successfully' };
    }
}
