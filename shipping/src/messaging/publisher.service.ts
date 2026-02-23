import { Injectable } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';

@Injectable()
export class PublisherService {
  constructor(private readonly rabbit: RabbitConnection) {}

  async publish(message: any) {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    

    await channel.assertExchange('orders.fanout', 'fanout', { durable: true });
    channel.publish(
      'orders.fanout',
      'fanout',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    const q = await channel.assertQueue('orders.queue', { durable: true });
    await channel.bindQueue(q.queue, 'orders.fanout', '');

    console.log('Published Message Id:', message);
  }
}
