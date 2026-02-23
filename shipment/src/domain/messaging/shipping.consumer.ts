import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';

@Injectable()
export class ShippingConsumerService implements OnModuleInit {
  constructor(private readonly rabbit: RabbitConnection) {}

  async onModuleInit() {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);

    await channel.assertExchange('orders.shipment', 'direct', { durable: true });

    const q = await channel.assertQueue('shipment.queue', { durable: true });
    await channel.bindQueue(q.queue, 'orders.shipment', 'direct');

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log(' Shipping Received:', data);

      channel.ack(msg);
    });
  }
}