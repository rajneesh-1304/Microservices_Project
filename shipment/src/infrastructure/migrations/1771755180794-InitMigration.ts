import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771755180794 implements MigrationInterface {
    name = 'InitMigration1771755180794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipping" ("product_id" uuid NOT NULL, "quantity_on_hand" integer NOT NULL, CONSTRAINT "PK_da0dae6fc16aeb86d0160a21823" PRIMARY KEY ("product_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shipping"`);
    }

}
