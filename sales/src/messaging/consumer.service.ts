import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';
import { Order } from '../order/order.entity';
import { Inbox } from 'src/inbox/inbox.entity';

@Injectable()
export class ConsumerService {
    constructor(private readonly rabbit: RabbitConnection, private dataSource: DataSource) { }

    async shipment() {
        const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
        const repo = this.dataSource.getRepository(Order);
        const inboxRepo = this.dataSource.getRepository(Inbox);
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
            console.log(data)
            if (data.message === 'Payment Success') {
                await repo.update(data.order_id, { status: 'BILLED' });
                await inboxRepo.save({ messageId: data.order_id, handler: "Billed" });
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
                const isPresent = await inboxRepo.findOne({ where: { messageId: data.order_id, handler: 'Billed' } });
                if(isPresent){
                    await repo.update(data.order_id, { status: 'READY_TO_SHIP' });
                    console.log('Order is ready to ship...')
                }
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