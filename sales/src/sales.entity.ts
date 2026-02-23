import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('sales')
export class SalesProduct {
  @PrimaryColumn('uuid')
  product_id: string;

  @Column('decimal')
  price: number;
}