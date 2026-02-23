import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Order")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  order_id: number;

  @Column()
  user_id: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  products: {
    product_id: string;
    price: number;
  }[];

  @Column()
  billing_account_id: string;

  @Column({ default: "PENDING" })
  status: 'PENDING' | 'PAYMENT_FAILED' | 'PLACED' | 'BILLED' | 'READY_TO_SHIP' | 'CANCELLED'
}