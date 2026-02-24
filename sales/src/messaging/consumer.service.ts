import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';
import { Order } from '../order/order.entity';

@Injectable()
export class ConsumerService {
    constructor(private readonly rabbit: RabbitConnection, private dataSource: DataSource) { }

    async shipment() {
        const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
        const repo = this.dataSource.getRepository(Order);
        await channel.assertExchange('billing.direct', 'direct', {
            durable: true,
        });
        const sq = await channel.assertQueue('billing.queue', { durable: true });
        await channel.bindQueue(sq.queue, 'billing.direct', 'direct');
        let d: any = null;

        await channel.assertExchange('orders.placed', 'direct', { durable: true });
        const placedQueue = await channel.assertQueue('placed.queue', { durable: true });
        await channel.bindQueue(placedQueue.queue, 'orders.placed', 'direct');

        channel.consume(sq.queue, async (msg) => {
            if (!msg) return;

            const data = JSON.parse(msg.content.toString());
            d = data;
            if (data.message === 'Payment Success') {
                await repo.update(data.order_id, { status: 'BILLED' });
                console.log('Order billed...');
            } else {
                await repo.update(data.order_id, { status: 'PAYMENT_FAILED' })
                console.log('Payment failed...');
            }

            channel.ack(msg);
        });

        channel.consume(placedQueue.queue, async (msg) => {
            if (!msg) return;
            const data = JSON.parse(msg.content.toString());
            if (data.message === 'Ready') {
                await repo.update(data.order_id, { status: 'READY_TO_SHIP' });
                console.log('Order is ready to ship...')
            } else if (data.message === 'Failed') { 
                await repo.update(data.order_id, { status: 'CANCELLED' });
                console.log('Order shipment failed...')
            }
            else {
                await repo.update(data.order_id, { status: 'CANCELLED' })
                console.log('Order is cancelled...');
            }
            channel.ack(msg);
        });
    }
}