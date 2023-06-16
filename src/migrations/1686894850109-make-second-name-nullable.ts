import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSecondNameNullable1686894850109 implements MigrationInterface {
  name = 'MakeSecondNameNullable1686894850109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "second_name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "second_name" SET NOT NULL`,
    );
  }
}
