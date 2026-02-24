import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ShippingProduct } from './domain/shipping_products.entity';
import { Shipment } from './domain/shipment.entity';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async seedShipping(){
    const repo = this.dataSource.getRepository(ShippingProduct); 
    const data = [
      { product_id: 'b17f77ae-5d5d-4183-a1f5-979c45a5f57f', quantity_on_hand: 15 },
      { product_id: '2b8a7b36-fb21-4ad8-a124-25d607c3e55c', quantity_on_hand: 25 },
      { product_id: '7c91f4b0-8d42-47f1-98c4-b3f975be3a41', quantity_on_hand: 10 },
      { product_id: 'e7a23cbb-4c59-4233-8d38-f2b82c3f949e', quantity_on_hand: 50 },
      { product_id: '9f3e1a65-5af7-4d1a-a08b-6d7c78d8a19e', quantity_on_hand: 7 },
    ];
    
    await repo.save(data);
    return { message: 'Shipping seeded' };
  }

  async createShipment(data: any){
    const shippingRepo = this.dataSource.getRepository(Shipment);
    const shpment = shippingRepo.create({
      order_id: data.orderId,
      address: data.address,
      products: data.products.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,})),
    });
    await shippingRepo.save(shpment);
  }
}
