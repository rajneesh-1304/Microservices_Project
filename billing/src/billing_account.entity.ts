import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('billing_accounts')
export class BillingAccount {
  @PrimaryColumn('uuid')
  billing_account_id: string;

  @Column()
  card_number: string;

  @Column('decimal')
  balance: number;
}