import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed/all')
  async seedAll() {
    await axios.post('http://billing-service:3001/billing/seedbills');
    await axios.post('http://sales-service:3002/sales/seedsales');
    await axios.post('http://shipment-service:3003/shipping/seedshipping');

    return { message: 'All services seeded successfully' };
  }
}
