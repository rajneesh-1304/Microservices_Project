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
    const failedShipment = await channel.assertQueue('failedShipment.queue', { durable: true });
    channel.consume(q.queue, async (msg) => {

      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      const isPresent = await repo.findOne({ where: { messageId: data.id } });
      if (isPresent) {
        channel.ack(msg);
        return;
      }
      let retryCount = 0;
      let success = false;
      while (retryCount < 5) {
        try {
          const billingRepo = this.dataSource.getRepository(Billing);
          const accountRepo = this.dataSource.getRepository(BillingAccount);
          const isPresentBill: any = await billingRepo.findOne({ where: { order_id: data.message.order_id } });
          const isPresentAccount = await accountRepo.findOne({ where: { billing_account_id: isPresentBill?.billing_accound_id } });
          if (!isPresentBill) {
            throw new NotFoundException('Order Bill not found');
          }
          if (!isPresentAccount) {
            throw new NotFoundException('Account detail not found');
          }

          if (Number(isPresentAccount.balance) >= Number(isPresentBill.totalamount)) {
            await repo.save({ messageId: data.id, handler: "DEFAULT" });
            const amountLeft = isPresentAccount.balance - isPresentBill.totalamount;
            await accountRepo.update(isPresentAccount.billing_account_id, { balance: amountLeft });
            channel.publish(
              'billing.direct',
              'direct',
              Buffer.from(JSON.stringify({ message: "Payment Success", order_id: data.message.order_id })),
              { persistent: true }
            );
            channel.publish('orders.shipment', 'direct', Buffer.from(JSON.stringify({ message: "Payment Success", order_id: data.message.order_id })), { persistent: true })
          } else {
            channel.publish(
              'billing.direct',
              'direct',
              Buffer.from(JSON.stringify({ message: "Payment Failed", order_id: data.message.order_id })),
              { persistent: true }
            );
          }

          success = true;
          break;
        } catch (error) {
          retryCount++;
        }
      }
      if(!success) {
          channel.publish(
            'orders.retry.exchange',
            'routingKey',
            Buffer.from(JSON.stringify(msg)),
            { persistent: true },
          );

          const retryQueue = await channel.assertQueue('orders.retry.queue', {
            durable: true,
          })

          await channel.bindQueue(retryQueue.queue, 'orders.retry.exchange', 'routingKey');
        }

      channel.ack(msg);
    });

    channel.consume(failedShipment.queue, async(msg)=>{
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());
      console.log(data);
      const billingRepo = this.dataSource.getRepository(Billing);
      const accountRepo = this.dataSource.getRepository(BillingAccount);
      const isPresent = await billingRepo.findOne({where:{order_id: data.order_id}})
      const amount:any = await accountRepo.findOne({where: {billing_account_id:isPresent?.billing_accound_id}});
      const refund = amount?.balance+isPresent?.totalamount;
      await accountRepo.update({billing_account_id:isPresent?.billing_accound_id},{balance: refund});

      channel.publish(
              'billing.direct',
              'direct',
              Buffer.from(JSON.stringify({ message: "Refunded", order_id: data.message.order_id })),
              { persistent: true }
            );
      channel.ack(msg);
    })
  }
}