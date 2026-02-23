import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';
import { Billing } from '../billing/billing.entity';
import { Inbox } from '../inbox/inbox.entity';
import { BillingAccount } from 'src/billing_account.entity';

@Injectable()
export class BillingConsumerService implements OnModuleInit {
  constructor(private readonly rabbit: RabbitConnection, private dataSource: DataSource) { }

  async onModuleInit() {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    const repo = this.dataSource.getRepository(Inbox);
    await channel.assertExchange('orders.fanout', 'fanout', { durable: true });
    const q = await channel.assertQueue('orders.queue', { durable: true });
    await channel.bindQueue(q.queue, 'orders.fanout', '');
    await channel.assertExchange('billing.direct', 'direct', {
      durable: true,
    });

     await channel.assertExchange('orders.shipment', 'direct', { durable: true });

    const shipmentQueue = await channel.assertQueue('shipment.queue', { durable: true });
    await channel.bindQueue(shipmentQueue.queue, 'orders.shipment', 'direct');
    const sq = await channel.assertQueue('billing.queue', { durable: true });
    await channel.bindQueue(sq.queue, 'billing.direct', 'direct');
    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      const isPresent = await repo.findOne({ where: { messageId: data.id } });
      if (isPresent) {
        channel.ack(msg);
        return;
      }
      const billingRepo = this.dataSource.getRepository(Billing);
      const accountRepo = this.dataSource.getRepository(BillingAccount);
      const isPresentAccount = await accountRepo.findOne({ where: { billing_account_id: msg.billing_accound_id } });
      if (!isPresentAccount) {
        throw new NotFoundException('Account detail not found');
      }
      if (isPresentAccount.balance > data.message.products[0].price) {
        await repo.save({ messageId: data.id, handler: "DEFAULT" });
        await billingRepo.save({ order_id: data.message.order_id, billing_accound_id: data.message.billing_account_id })
        channel.publish(
          'billing.direct',
          'direct',
          Buffer.from(JSON.stringify({message:"Payment Success", order_id:data.message.order_id})),
          { persistent: true }
        );
        channel.publish('orders.shipment', 'direct', Buffer.from(JSON.stringify({message:"Payment Success", order_id:data.message.order_id})), { persistent: true })
      } else {
        channel.publish(
          'billing.direct',
          'direct',
          Buffer.from(JSON.stringify({message:"Payment Failed", order_id:data.message.order_id})),
          { persistent: true }
        );
      }

      channel.ack(msg);
    });
  }
}