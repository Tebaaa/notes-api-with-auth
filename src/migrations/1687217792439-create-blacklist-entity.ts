import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlacklistEntity1687217792439 implements MigrationInterface {
    name = 'CreateBlacklistEntity1687217792439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blacklist" ("id" SERIAL NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, CONSTRAINT "PK_04dc42a96bf0914cda31b579702" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blacklist"`);
    }

}
