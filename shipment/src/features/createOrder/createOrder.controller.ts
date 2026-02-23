import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderService } from './createOrder.service';

@Controller('shipping')
export class CreateOrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Get()
  getHello(): string {
    return this.createOrderService.getHello();
  }

  @Post('createOrder')
  seedShipping(@Body() order: any) {
    return this.createOrderService.createOrder(order);
  }
}
