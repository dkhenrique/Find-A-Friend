import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrgFieldsAndPetCharacteristics1774300000000
  implements MigrationInterface
{
  name = 'AddOrgFieldsAndPetCharacteristics1774300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Campos de ORG na tabela users
    await queryRunner.query(
      `ALTER TABLE "users" ADD "address" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "city" character varying(100) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "state" character varying(2) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "zip_code" character varying(10) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "whatsapp" character varying(20) NOT NULL DEFAULT ''`,
    );

    // Índice na cidade para busca performática
    await queryRunner.query(
      `CREATE INDEX "IDX_users_city" ON "users" ("city")`,
    );

    // Campos de características na tabela pets
    await queryRunner.query(
      `ALTER TABLE "pets" ADD "age" character varying(20) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" ADD "size" character varying(20) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" ADD "energy_level" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" ADD "independence_level" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" ADD "environment" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "pets" ADD "description" text`);

    // Tabela join para ManyToMany pets <-> pet_requirements
    await queryRunner.query(
      `CREATE TABLE "pets_pet_requirements_pet_requirements" ("petsId" uuid NOT NULL, "petRequirementsId" uuid NOT NULL, CONSTRAINT "PK_pets_requirements_join" PRIMARY KEY ("petsId", "petRequirementsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_pets_requirements_petsId" ON "pets_pet_requirements_pet_requirements" ("petsId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_pets_requirements_petRequirementsId" ON "pets_pet_requirements_pet_requirements" ("petRequirementsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets_pet_requirements_pet_requirements" ADD CONSTRAINT "FK_pets_requirements_petsId" FOREIGN KEY ("petsId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets_pet_requirements_pet_requirements" ADD CONSTRAINT "FK_pets_requirements_petRequirementsId" FOREIGN KEY ("petRequirementsId") REFERENCES "pet_requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join table
    await queryRunner.query(
      `ALTER TABLE "pets_pet_requirements_pet_requirements" DROP CONSTRAINT "FK_pets_requirements_petRequirementsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets_pet_requirements_pet_requirements" DROP CONSTRAINT "FK_pets_requirements_petsId"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_pets_requirements_petRequirementsId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_pets_requirements_petsId"`);
    await queryRunner.query(
      `DROP TABLE "pets_pet_requirements_pet_requirements"`,
    );

    // Drop pet characteristics columns
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "environment"`);
    await queryRunner.query(
      `ALTER TABLE "pets" DROP COLUMN "independence_level"`,
    );
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "energy_level"`);
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "age"`);

    // Drop user ORG columns
    await queryRunner.query(`DROP INDEX "IDX_users_city"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "zip_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
  }
}
