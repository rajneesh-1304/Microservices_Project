import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  AppDataSource  from './data-source'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherService } from './messaging/publisher.service';
import { MessagingModule } from './messaging/messaging.module';
import { RabbitConnection } from './messaging/rabbit.connection';
import { OutboxModule } from './services/outbox.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      ...AppDataSource.options, 
    }),
  OutboxModule],
  controllers: [AppController],
  providers: [AppService, PublisherService, RabbitConnection],
})
export class AppModule {}
