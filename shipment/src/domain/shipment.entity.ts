import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('shipment')
export class Shipment {
  @PrimaryColumn()
  order_id: string;

  @Column()
  address: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  products: {
    product_id: string;
    quantity: number;
  }[];
}