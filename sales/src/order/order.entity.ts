import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Order")
export class Order {
  @Column()
  order_id: string;

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

  @Column({ default: "PENDING" })
  status: 'PENDING' | 'PAYMENT_FAILED' | 'PLACED' | 'BILLED' | 'READY_TO_SHIP' | 'CANCELLED'
}