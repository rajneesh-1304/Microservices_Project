import { Module } from '@nestjs/common';
import { PublishCommand } from './command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitConnection } from 'src/domain/messaging/rabbit.connection';
import { ShipmentConsumer } from 'src/domain/messaging/consumer.service';
import AppDataSource from '../../data-source';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...AppDataSource.options,
  }), TypeOrmModule.forFeature([]),
],
  providers: [PublishCommand, ShipmentConsumer, RabbitConnection],
})
export class Command { }
