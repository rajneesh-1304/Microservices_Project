import { IsString, IsNotEmpty, IsIn, ArrayNotEmpty, IsNumber, ArrayMaxSize, IsDate } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsNotEmpty()
    products: object[];

    @IsNotEmpty()
    address: string;
}