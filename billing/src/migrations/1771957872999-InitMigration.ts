// import { MigrationInterface, QueryRunner } from "typeorm";

// export class InitMigration1771957872999 implements MigrationInterface {
//     name = 'InitMigration1771957872999'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "Billing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" character varying NOT NULL, "billing_accound_id" character varying NOT NULL, "totalamount" numeric(10,2) NOT NULL, CONSTRAINT "PK_06a75c433ee7cf3ed893fbfac43" PRIMARY KEY ("id"))`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DROP TABLE "Billing"`);
//     }

// }
