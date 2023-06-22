import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNoteEntity1687394483035 implements MigrationInterface {
    name = 'CreateNoteEntity1687394483035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_654d6da35fcab12c3905725a416" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_654d6da35fcab12c3905725a416"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
