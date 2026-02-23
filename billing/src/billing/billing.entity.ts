import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Billing")
export class Billing{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    order_id: string;

    @Column()
    billing_accound_id: string;
}