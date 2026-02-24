import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublisherService } from './messaging/publisher.service';

@Controller('sales')
export class AppController {
  constructor(private readonly appService: AppService, private readonly publisher: PublisherService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seedsales')
  seedSales() {
    return this.appService.seedSales();
  }

  @Post('order')
  createOrder(@Body() order:any) {
    return this.appService.createorder(order);
  }
}
