import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771912403241 implements MigrationInterface {
    name = 'InitMigration1771912403241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_0da681a4040e6b083519e1ca51d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipping" ("product_id" uuid NOT NULL, "quantity_on_hand" integer NOT NULL, CONSTRAINT "PK_da0dae6fc16aeb86d0160a21823" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE TABLE "Inbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "handler" character varying NOT NULL, CONSTRAINT "PK_bb34f42fe318b185796b7e751fc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Inbox"`);
        await queryRunner.query(`DROP TABLE "shipping"`);
        await queryRunner.query(`DROP TABLE "Outbox"`);
    }

}
