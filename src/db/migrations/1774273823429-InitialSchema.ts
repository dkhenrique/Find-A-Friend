import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1774273823429 implements MigrationInterface {
  name = 'InitialSchema1774273823429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pet_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "Url" character varying(255) NOT NULL, "description" character varying(200), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "pet_id" uuid, CONSTRAINT "PK_0a7b8bd06eedbac790fadfe1f17" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pet_requirements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, CONSTRAINT "PK_91aed0552454b830631870658d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "especie" character varying NOT NULL, "adotado" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "adoptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notes" text, "adopted_at" TIMESTAMP NOT NULL DEFAULT now(), "adopter_id" uuid, "pet_id" uuid, CONSTRAINT "PK_f3897fdb8f8f34600711b59183b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(70) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_photos" ADD CONSTRAINT "FK_aa9917587f051e28bd2514a7c94" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" ADD CONSTRAINT "FK_4ddf2615c9d24b5be6d26830b4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adoptions" ADD CONSTRAINT "FK_9a401881ecb9d48d0d252c3bd20" FOREIGN KEY ("adopter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "adoptions" ADD CONSTRAINT "FK_bfac9cda75ee08a343c5086f2da" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "adoptions" DROP CONSTRAINT "FK_bfac9cda75ee08a343c5086f2da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "adoptions" DROP CONSTRAINT "FK_9a401881ecb9d48d0d252c3bd20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pets" DROP CONSTRAINT "FK_4ddf2615c9d24b5be6d26830b4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_photos" DROP CONSTRAINT "FK_aa9917587f051e28bd2514a7c94"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "adoptions"`);
    await queryRunner.query(`DROP TABLE "pets"`);
    await queryRunner.query(`DROP TABLE "pet_requirements"`);
    await queryRunner.query(`DROP TABLE "pet_photos"`);
  }
}
