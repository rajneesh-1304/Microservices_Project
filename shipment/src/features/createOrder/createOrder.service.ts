import { Injectable } from '@nestjs/common';
import { ShippingProduct } from 'src/domain/shipping_products.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateOrderService {
  constructor(private dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  createOrder(order){
    const shippingRepo = this.dataSource.getRepository(ShippingProduct);
    if(!order){
        return;
    }

    
  }

}
