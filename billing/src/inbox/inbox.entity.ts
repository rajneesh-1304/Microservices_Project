import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Inbox")
export class Inbox{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    messageId: string;

    @Column()
    handler: string;
}