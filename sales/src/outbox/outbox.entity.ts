import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Outbox")
export class Outbox{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column("simple-json")
    message: object;

    @Column({default:"PENDING"})
    status: 'PENDING' | 'COMPLETED'
}