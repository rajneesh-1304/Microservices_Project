import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771996036995 implements MigrationInterface {
    name = 'InitMigration1771996036995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Billing" ADD "totalamount" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Billing" DROP COLUMN "totalamount"`);
    }

}
