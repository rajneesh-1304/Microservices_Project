import { Module } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';

@Module({
  imports: [],
  providers: [
    RabbitConnection,
  ],
  exports: [],
})
export class MessagingModule {}
