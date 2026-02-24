import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';
import { Inbox } from 'src/infrastructure/inbox/inbox.entity';

@Injectable()
export class ShipmentConsumer {
  constructor(private readonly rabbit: RabbitConnection, private dataSource: DataSource) { }

  async shipment() {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    await channel.assertExchange('billing.direct', 'direct', {
      durable: true,
    });

    const inboxRepo = this.dataSource.getRepository(Inbox);
    await channel.assertExchange('orders.fanout', 'fanout', { durable: true });
    const orderShipQueue = await channel.assertQueue('order.shipmentQueue', {durable:true});
    await channel.bindQueue(orderShipQueue.queue, 'orders.fanout', '');


    await channel.assertExchange('orders.shipment', 'direct', { durable: true });
    const shipmentQueue = await channel.assertQueue('shipment.queue', { durable: true });
    await channel.bindQueue(shipmentQueue.queue, 'orders.shipment', 'direct');
    await channel.assertExchange('orders.placed', 'direct', { durable: true });
    const placedQueue = await channel.assertQueue('placed.queue', { durable: true });
    await channel.bindQueue(placedQueue.queue, 'orders.placed', 'direct');
    const sq = await channel.assertQueue('billing.queue', { durable: true });
    await channel.bindQueue(sq.queue, 'billing.direct', 'direct');

    channel.consume(orderShipQueue.queue, async (msg) => {
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());
      console.log(data, 'this is data')
      const isExist = await inboxRepo.findOne({where: {message: data.message.order_id}});
      console.log(isExist, 'this is isexist')
      if(!isExist){
        const entry = inboxRepo.create({message: data.message.order_id, handler:'Placed'})
        await inboxRepo.save(entry);
      }
      console.log('shipment received the messages...after sales');
      channel.ack(msg);
    });
    
    channel.consume(shipmentQueue.queue, async (msg) => {
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());
      const isPresent = await inboxRepo.findOne({where: {message: data.message.order_id, handler:'Placed'}});
      console.log(isPresent, "isPresetn")
      if(isPresent){
        data.message='Ready'
        channel.publish(
        'orders.placed',
        'direct',
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
      );
      }else{
        //requeue
      }

      channel.ack(msg);
    });
  }
}