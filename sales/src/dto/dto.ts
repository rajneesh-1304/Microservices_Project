import { IsString, IsNotEmpty, IsIn, ArrayNotEmpty, IsNumber, ArrayMaxSize, IsDate } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    products: object[];
}