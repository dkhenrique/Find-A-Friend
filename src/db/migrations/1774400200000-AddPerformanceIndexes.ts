import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1774400200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Índice na coluna city dos users — acelera busca de pets por cidade
    await queryRunner.query(
      `CREATE INDEX "idx_users_city" ON "users" ("city")`,
    );

    // Índice na coluna status dos pets — acelera filtro de pets disponíveis
    await queryRunner.query(
      `CREATE INDEX "idx_pets_status" ON "pets" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_pets_status"`);
    await queryRunner.query(`DROP INDEX "idx_users_city"`);
  }
}
