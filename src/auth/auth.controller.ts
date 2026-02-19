import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { dot } from 'node:test/reporters';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
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
