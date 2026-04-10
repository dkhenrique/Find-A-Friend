import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1775843589087 implements MigrationInterface {
    name = 'AddPerformanceIndexes1775843589087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_pets_status" ON "pets" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_city" ON "users" ("city") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_users_city"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_pets_status"`);
    }

}
