import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771964145269 implements MigrationInterface {
    name = 'InitMigration1771964145269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Inbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "messageId" character varying NOT NULL, "handler" character varying NOT NULL, CONSTRAINT "PK_bb34f42fe318b185796b7e751fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Order" DROP CONSTRAINT "PK_9f34c73293ac98f27b3f43187b4"`);
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "Order" ADD "order_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Order" ADD CONSTRAINT "PK_9f34c73293ac98f27b3f43187b4" PRIMARY KEY ("order_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" DROP CONSTRAINT "PK_9f34c73293ac98f27b3f43187b4"`);
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "Order" ADD "order_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Order" ADD CONSTRAINT "PK_9f34c73293ac98f27b3f43187b4" PRIMARY KEY ("order_id")`);
        await queryRunner.query(`DROP TABLE "Inbox"`);
    }

}
