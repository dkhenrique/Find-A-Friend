import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPetRequirements1775843276975 implements MigrationInterface {
    name = 'AddPetRequirements1775843276975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_pets_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_city"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_city"`);
        await queryRunner.query(`CREATE TABLE "pets_requirements_pet_requirements" ("petsId" uuid NOT NULL, "petRequirementsId" uuid NOT NULL, CONSTRAINT "PK_8f8f4150de73558505f2b987718" PRIMARY KEY ("petsId", "petRequirementsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_952f870d19b08faa72dab1c139" ON "pets_requirements_pet_requirements" ("petsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_676ec967af2a5d4ce831bb7176" ON "pets_requirements_pet_requirements" ("petRequirementsId") `);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "age" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "size" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "city" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "zip_code" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "whatsapp" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pets_requirements_pet_requirements" ADD CONSTRAINT "FK_952f870d19b08faa72dab1c139a" FOREIGN KEY ("petsId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pets_requirements_pet_requirements" ADD CONSTRAINT "FK_676ec967af2a5d4ce831bb71768" FOREIGN KEY ("petRequirementsId") REFERENCES "pet_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets_requirements_pet_requirements" DROP CONSTRAINT "FK_676ec967af2a5d4ce831bb71768"`);
        await queryRunner.query(`ALTER TABLE "pets_requirements_pet_requirements" DROP CONSTRAINT "FK_952f870d19b08faa72dab1c139a"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "whatsapp" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "zip_code" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "state" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "city" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "size" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pets" ALTER COLUMN "age" SET DEFAULT ''`);
        await queryRunner.query(`DROP INDEX "public"."IDX_676ec967af2a5d4ce831bb7176"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_952f870d19b08faa72dab1c139"`);
        await queryRunner.query(`DROP TABLE "pets_requirements_pet_requirements"`);
        await queryRunner.query(`CREATE INDEX "idx_users_city" ON "users" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_city" ON "users" ("city") `);
        await queryRunner.query(`CREATE INDEX "idx_pets_status" ON "pets" ("status") `);
    }

}
