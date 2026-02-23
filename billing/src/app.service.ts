import { Injectable } from '@nestjs/common';
import { BillingAccount } from './billing_account.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async seedBilling(){
    const repo = this.dataSource.getRepository(BillingAccount); 
    const data = [
      { billing_account_id: 'c1d7a1b4-6ef3-44a2-b97f-3a7e2f405bd4', card_number: '4111111111111111', balance: 120.5 },
      { billing_account_id: 'a2f89d3c-b671-4fd6-88cd-f8cdb66f09e1', card_number: '5500000000000004', balance: 250.75 },
      { billing_account_id: 'f3e7c5d1-6c82-4a28-bb8e-0d3f78f3ab90', card_number: '4111222233334444', balance: 89.3 },
      { billing_account_id: 'd4b2f843-8e6b-4f57-9b4f-5a4c5a73b512', card_number: '5424000000000015', balance: 480 },
      { billing_account_id: 'e5c6d3a7-7da2-4db8-bc44-3b3b84b2a9f0', card_number: '4532015112830366', balance: 310.2 },
    ];

    await repo.save(data);
    return { message: 'Billing seeded' };
  }
}
