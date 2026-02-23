import * as amqp from 'amqplib';
import { setTimeout } from 'node:timers';

export class RabbitConnection {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async connect(url) {
        try {
            if(this.channel) return this.channel;
            this.connection = await amqp.connect(url);
            this.connection.on('close', () => this.reconnect(url));
            this.connection.on('error', () => this.reconnect(url));
            this.channel = await this.connection.createChannel();
            return this.channel;
        } catch (error) {
            console.log('Retrying RabbitMq Connection...');
            setTimeout(() => this.connect(url), 1000);
        }
    }

    private reconnect(url) {
        console.log('Reconnecting RabbitMq...');
        setTimeout(() => this.connect(url), 1000)
    }
}