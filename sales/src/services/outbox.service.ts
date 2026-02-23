import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Outbox } from "../outbox/outbox.entity";
import { Order } from "../order/order.entity";

@Injectable()
export class OutboxService {
  constructor( private readonly dataSource: DataSource
  ) {}

  async getPendingMsg() {
    const outboxRepo = this.dataSource.getRepository(Outbox);
    const pendingMsg = await outboxRepo.find({where: {status:"PENDING"}});
    return pendingMsg;
  }

  async markDispatched(id: any) {
    const outboxRepo = this.dataSource.getRepository(Outbox);
    const orderRepo = this.dataSource.getRepository(Order);
    await outboxRepo.update(id, { status: 'COMPLETED' });
    await orderRepo.update({order_id: id}, {status: "PLACED"});
  }
}
