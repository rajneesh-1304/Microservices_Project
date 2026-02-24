import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("Order")
export class Order {
  @PrimaryColumn()
  order_id: string;

  @Column()
  user_id: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  products: {
    product_id: string;
    quantity: number;
  }[];

  @Column({ default: "PENDING" })
  status: 'PENDING' | 'PAYMENT_FAILED' | 'PLACED' | 'BILLED' | 'READY_TO_SHIP' | 'CANCELLED'
}