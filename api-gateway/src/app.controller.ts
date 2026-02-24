import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed/all')
  async seedAll() {
    await axios.post('http://localhost:3002/api/seedbills');
    await axios.post('http://localhost:3001/api/seedsales');
    await axios.post('http://localhost:3003/api/seedshipping');

    return { message: 'All services seeded successfully' };
  }

  @Post('order')
  async order(@Body() data: any){
    console.log(data);
    const idd=uuidv4();
    const orderData = {
      id: idd,
      userId: data.userId,
      products: data.products,
    }

    const billingData = {
      orderId: idd,
      billing_account_id: data.billing_account_id,
      totalamount: data.totalamount
    }

    const shipmentData = {
      orderId: idd,
      address: data.address,
      products: data.products
    }

    await axios.post('http://localhost:3001/api/order', orderData);
    await axios.post('http://localhost:3002/api/bill', billingData);
    await axios.post('http://localhost:3003/api/shipment', shipmentData);
    return {message: 'Order created successfully!'};
  }
}
