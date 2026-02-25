import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SalesProduct } from './sales.entity';
import { Outbox } from './outbox/outbox.entity';
import { Order } from './order/order.entity';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) { }
  getHello(): string {
    return 'Hello World!';
  }

  async seedSales() {
    const repo = this.dataSource.getRepository(SalesProduct);
    const data = [
      { product_id: 'b17f77ae-5d5d-4183-a1f5-979c45a5f57f', price: 89.99 },
      { product_id: '2b8a7b36-fb21-4ad8-a124-25d607c3e55c', price: 59.99 },
      { product_id: '7c91f4b0-8d42-47f1-98c4-b3f975be3a41', price: 149.99 },
      { product_id: 'e7a23cbb-4c59-4233-8d38-f2b82c3f949e', price: 19.99 },
      { product_id: '9f3e1a65-5af7-4d1a-a08b-6d7c78d8a19e', price: 299.99 },
    ];

    await repo.save(data);
    return { message: 'Sales seeded' };
  }

  async createorder(order: any) {
    const orderRepo = this.dataSource.getRepository(Order);
    const orderEntity = orderRepo.create({
      order_id: order.id,
      user_id: order.userId,
      products: order.products.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,
      })),
    });
    await orderRepo.save(orderEntity);
    return { message: "Order created successfully" };
  }

  async placeOrder(id: string) {
    const orderRepo = this.dataSource.getRepository(Order);
    const order = await orderRepo.findOne({ where: { order_id: id } });
    if (!order) {
      return { message: 'Order not found' };
    } else {
      const outRepo = this.dataSource.getRepository(Outbox);
      const data = outRepo.create({ message: order });
      await outRepo.save(data);
      order.status = 'PLACED';
      await orderRepo.save(order);
      return { message: 'Order placed successfully' };
    }
  }

}
