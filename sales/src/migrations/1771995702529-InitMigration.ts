import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771995702529 implements MigrationInterface {
    name = 'InitMigration1771995702529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "billing_account_id"`);
        await queryRunner.query(`ALTER TABLE "Order" DROP COLUMN "address"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Order" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Order" ADD "billing_account_id" character varying NOT NULL`);
    }

}
