import { Module } from '@nestjs/common';
import { CreateOrderController } from './createOrder.controller';
import { CreateOrderService } from './createOrder.service';

@Module({
  imports: [],
  controllers: [CreateOrderController],
  providers: [CreateOrderService],
})
export class CreateOrderModule {}
