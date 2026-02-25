import { IsString, IsNotEmpty, IsIn, ArrayNotEmpty, IsNumber, ArrayMaxSize, IsDate } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsNotEmpty()
    @IsString()
    billing_account_id: string;

    @IsNotEmpty()
    totalamount: string;
}