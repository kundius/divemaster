import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddVtb1759350402784 implements MigrationInterface {
  name = 'AddVtb1759350402784'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`service\` \`service\` enum ('Vtb', 'Yookassa', 'UponCash') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`service\` \`service\` enum ('Yookassa', 'UponCash') NOT NULL`
    )
  }
}
