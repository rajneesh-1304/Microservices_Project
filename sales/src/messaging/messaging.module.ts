import { Module } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { PublisherService } from './publisher.service';
import { OutboxService } from 'src/services/outbox.service';

@Module({
  imports: [],
  providers: [
    RabbitConnection,
    PublisherService,
    OutboxService
  ],
  exports: [PublisherService, RabbitConnection, OutboxService],
})
export class MessagingModule {}
