import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublisherService } from './messaging/publisher.service';
import { CreateOrderDto } from './dto/dto';

@Controller('api')
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
  createOrder(@Body() order:CreateOrderDto) {
    return this.appService.createorder(order);
  }

  @Patch('order/:id')
  placeOrder(@Param('id') id:string) {
    this.appService.placeOrder(id);
  }
}
