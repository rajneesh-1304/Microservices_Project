import { Module } from '@nestjs/common';
import { PublishCommand } from './command';
import { RabbitConnection } from '../messaging/rabbit.connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../data-source';
import { BillingConsumerService } from '../messaging/consumer.service';
import { Inbox } from '../inbox/inbox.entity';
import { Billing } from '../billing/billing.entity';
import { BillingAccount } from '../billing_account.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...AppDataSource.options,
  }), TypeOrmModule.forFeature([Inbox]),
  TypeOrmModule.forFeature([Billing]),
  TypeOrmModule.forFeature([BillingAccount]),
],
  providers: [PublishCommand, BillingConsumerService, RabbitConnection],
})
export class Command { }
