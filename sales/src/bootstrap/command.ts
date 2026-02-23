import { Command, CommandRunner, Option } from 'nest-commander';
import { ConsumerService } from 'src/messaging/consumer.service';

@Command({ name: 'sayHello', options: { isDefault: true } })
export class PublishCommand extends CommandRunner {

  constructor(
    private readonly consumer: ConsumerService,
  ) {
    super();
  }


  async run(inputs: string[], options?: Record<string, any>): Promise<void> {
    await this.consumer.shipment();
  }
}
