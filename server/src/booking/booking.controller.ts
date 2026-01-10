import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    create(@Body() createBookingDto: any) {
        return this.bookingService.create(createBookingDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.bookingService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body('status') status: string) {
        return this.bookingService.updateStatus(id, status);
    }
}
