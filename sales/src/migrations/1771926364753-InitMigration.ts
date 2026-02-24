import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771926364753 implements MigrationInterface {
    name = 'InitMigration1771926364753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("product_id" uuid NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_5015e2759303d7baaf47fc53cc8" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE TABLE "Outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_0da681a4040e6b083519e1ca51d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Order" ("order_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "products" jsonb NOT NULL, "billing_account_id" character varying NOT NULL, "address" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_9f34c73293ac98f27b3f43187b4" PRIMARY KEY ("order_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Order"`);
        await queryRunner.query(`DROP TABLE "Outbox"`);
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
