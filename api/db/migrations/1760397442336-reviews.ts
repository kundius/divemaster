import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760397442336 implements MigrationInterface {
  name = 'Reviews1760397442336'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`recommend\``)
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`isPublished\` tinyint NOT NULL DEFAULT 0`)
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`isRecommended\` tinyint NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`isRecommended\``)
    await queryRunner.query(`ALTER TABLE \`review\` DROP COLUMN \`isPublished\``)
    await queryRunner.query(`ALTER TABLE \`review\` ADD \`recommend\` tinyint NOT NULL`)
  }
}
