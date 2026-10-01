import { Controller, Get, Post } from '@nestjs/common';
import { SharedService } from './shared.service';

@Controller('visits')
export class SharedController {
    constructor(private readonly sharedService: SharedService) { }

    @Get()
    async getVisits() {
        return this.sharedService.getVisits();
    }

    @Post('increment')
    async incrementVisits() {
        return this.sharedService.incrementVisits();
    }
}
