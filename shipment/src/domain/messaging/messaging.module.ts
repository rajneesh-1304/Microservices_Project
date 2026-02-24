import { Module } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { PublisherService } from './publisher.service';
import { Inbox } from 'src/infrastructure/inbox/inbox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Inbox])],
  providers: [
    RabbitConnection,
    PublisherService,
  ],
  exports: [PublisherService],
})
export class MessagingModule {}
