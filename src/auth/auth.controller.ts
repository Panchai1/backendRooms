import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { dot } from 'node:test/reporters';
import { LoginDto } from './dto/login.dto';
import {JwtRefreshGuard} from './jwt/jwt-refresh.guard'


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // @Post('refresh')
    // refresh(@Body('refreshToken') refreshToken: string) {
    //     return this.authService.refresh(refreshToken);
    // }
    @UseGuards(JwtRefreshGuard) // ใช้ Guard ที่เราเพิ่งสร้าง
    @Post('refresh')
    async refresh(@Req() req: any) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;

        // เรียกใช้ฟังก์ชัน refresh ที่คุณเขียนไว้ก่อนหน้านี้
        return this.authService.refresh(refreshToken);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    logout(@Req() req) {
        return this.authService.logout(req.user.userId);
    }


}
