import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seedbills')
  seedBilling() {
    return this.appService.seedBilling();
  }

  @Post('bill')
  bill(@Body() data) {
    return this.appService.createBill(data);
  }

}
