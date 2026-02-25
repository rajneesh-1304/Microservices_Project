import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDto } from './dto/dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seedshipping')
  seedShipping() {
    return this.appService.seedShipping();
  }

  @Post('shipment')
  createShipment(@Body() data: CreateOrderDto) {
    return this.appService.createShipment(data);
  }
}
