import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Billing")
export class Billing{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    order_id: string;

    @Column()
    billing_accound_id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalamount: number;

    @Column()
    status: 'Pending' | 'Placed' | 'Ready_To_Ship' | 'Cancelled' | 'Payment_Failed' | 'Billed'
}