import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771958157553 implements MigrationInterface {
    name = 'InitMigration1771958157553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Inbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "handler" character varying NOT NULL, CONSTRAINT "PK_bb34f42fe318b185796b7e751fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment" ("order_id" character varying NOT NULL, "address" character varying NOT NULL, "products" jsonb NOT NULL, CONSTRAINT "PK_8326c2309eef8967ec2b38a05e7" PRIMARY KEY ("order_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shipment"`);
        await queryRunner.query(`DROP TABLE "Inbox"`);
    }

}
