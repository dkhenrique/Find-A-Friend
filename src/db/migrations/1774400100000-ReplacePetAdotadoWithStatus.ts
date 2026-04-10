import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplacePetAdotadoWithStatus1774400100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar nova coluna status
    await queryRunner.query(
      `ALTER TABLE "pets" ADD COLUMN "status" character varying(20) NOT NULL DEFAULT 'available'`,
    );

    // Migrar dados existentes
    await queryRunner.query(
      `UPDATE "pets" SET "status" = CASE WHEN "adotado" = true THEN 'adopted' ELSE 'available' END`,
    );

    // Remover coluna antiga
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "adotado"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pets" ADD COLUMN "adotado" boolean NOT NULL DEFAULT false`,
    );

    await queryRunner.query(
      `UPDATE "pets" SET "adotado" = CASE WHEN "status" = 'adopted' THEN true ELSE false END`,
    );

    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "status"`);
  }
}
