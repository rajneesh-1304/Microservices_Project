import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771755148257 implements MigrationInterface {
    name = 'InitMigration1771755148257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("product_id" uuid NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_5015e2759303d7baaf47fc53cc8" PRIMARY KEY ("product_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
