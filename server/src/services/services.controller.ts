import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createServiceDto: any) {
        return this.servicesService.create(createServiceDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() updateServiceDto: any) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
