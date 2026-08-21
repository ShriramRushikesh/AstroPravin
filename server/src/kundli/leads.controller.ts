import { Controller, Get, Param, Patch, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { KundliService } from './kundli.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('leads')
export class LeadsController {
    constructor(private readonly kundliService: KundliService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.kundliService.findAllLeads();
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/status')
    updateStatusPatch(@Param('id') id: string, @Body('status') status: string) {
        return this.kundliService.updateLeadStatus(id, status);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    updateStatusPut(@Param('id') id: string, @Body('status') status: string) {
        return this.kundliService.updateLeadStatus(id, status);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.kundliService.deleteLead(id);
    }
}
