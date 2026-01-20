import { Controller, Post, Body, Req } from '@nestjs/common';
import { KundliService } from './kundli.service';
import type { Request } from 'express';

@Controller('kundli')
export class KundliController {
    constructor(private readonly kundliService: KundliService) { }

    @Post('generate')
    async generate(@Body() body: any, @Req() req: Request) {
        const host = req.get('host') || 'localhost';
        const protocol = req.protocol;
        return this.kundliService.generate(body, host, protocol);
    }
}
