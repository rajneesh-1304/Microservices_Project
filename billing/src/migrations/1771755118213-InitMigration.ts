import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771755118213 implements MigrationInterface {
    name = 'InitMigration1771755118213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "billing_accounts" ("billing_account_id" uuid NOT NULL, "card_number" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_b9c8f78ce7da6bb288adbe3a6c2" PRIMARY KEY ("billing_account_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "billing_accounts"`);
    }

}
