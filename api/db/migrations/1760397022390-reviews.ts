import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760397022390 implements MigrationInterface {
  name = 'Reviews1760397022390'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`publishedAt\` timestamp NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`publishedAt\``)
  }
}
