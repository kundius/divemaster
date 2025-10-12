import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760137351826 implements MigrationInterface {
  name = 'Reviews1760137351826'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_review\` ADD \`recommend\` tinyint NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`product_review\` ADD \`rating\` int NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_review\` DROP COLUMN \`rating\``)
    await queryRunner.query(`ALTER TABLE \`product_review\` DROP COLUMN \`recommend\``)
  }
}
