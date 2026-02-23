import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('shipping')
export class ShippingProduct {
  @PrimaryColumn('uuid')
  product_id: string;

  @Column()
  quantity_on_hand: number;
}