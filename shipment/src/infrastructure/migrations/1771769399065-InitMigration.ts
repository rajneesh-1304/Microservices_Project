import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771769399065 implements MigrationInterface {
    name = 'InitMigration1771769399065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_0da681a4040e6b083519e1ca51d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Outbox"`);
    }

}
