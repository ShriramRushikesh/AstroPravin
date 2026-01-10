import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(password: string) {
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
        if (password === adminPassword) {
            const payload = { role: 'admin' };
            return {
                success: true,
                token: this.jwtService.sign(payload),
            };
        }
        throw new UnauthorizedException('Invalid Password');
    }
}
