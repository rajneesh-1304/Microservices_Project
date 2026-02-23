import { Command, CommandRunner, Option } from 'nest-commander';
import { BillingConsumerService } from '../messaging/consumer.service';

@Command({ name: 'sayHello', options: { isDefault: true } })
export class PublishCommand extends CommandRunner {

  constructor(
    private readonly consumer: BillingConsumerService,
  ) {
    super();
  }


  async run(inputs: string[], options?: Record<string, any>): Promise<void> {
    await this.consumer.onModuleInit();
  }
}
