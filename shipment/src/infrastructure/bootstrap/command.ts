import { Command, CommandRunner, Option } from 'nest-commander';
import { ShipmentConsumer } from 'src/domain/messaging/consumer.service';

@Command({ name: 'sayHello', options: { isDefault: true } })
export class PublishCommand extends CommandRunner {

  constructor(
    private readonly consumer: ShipmentConsumer,
  ) {
    super();
  }


  async run(inputs: string[], options?: Record<string, any>): Promise<void> {
    await this.consumer.shipment();
  }
}
