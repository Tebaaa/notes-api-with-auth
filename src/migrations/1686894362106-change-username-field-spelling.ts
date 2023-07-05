import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUsernameFieldSpelling1686894362106
  implements MigrationInterface
{
  name = 'ChangeUsernameFieldSpelling1686894362106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "user_name" TO "username"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_d34106f8ec1ebaf66f4f8609dd6" TO "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" TO "UQ_d34106f8ec1ebaf66f4f8609dd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "username" TO "user_name"`,
    );
  }
}
