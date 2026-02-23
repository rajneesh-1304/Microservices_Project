import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';

@Injectable()
export class ShipmentConsumer {
  constructor(private readonly rabbit: RabbitConnection, private dataSource: DataSource) { }

  async shipment() {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    await channel.assertExchange('billing.direct', 'direct', {
      durable: true,
    });
    await channel.assertExchange('orders.shipment', 'direct', { durable: true });
    const shipmentQueue = await channel.assertQueue('shipment.queue', { durable: true });
    await channel.bindQueue(shipmentQueue.queue, 'orders.shipment', 'direct');
    await channel.assertExchange('orders.placed', 'direct', { durable: true });
    const placedQueue = await channel.assertQueue('placed.queue', { durable: true });
    await channel.bindQueue(placedQueue.queue, 'orders.placed', 'direct');
    const sq = await channel.assertQueue('billing.queue', { durable: true });
    await channel.bindQueue(sq.queue, 'billing.direct', 'direct');
    channel.consume(shipmentQueue.queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      data.message='Ready'
      channel.publish(
      'orders.placed',
      'direct',
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );

      channel.ack(msg);
    });
  }
}