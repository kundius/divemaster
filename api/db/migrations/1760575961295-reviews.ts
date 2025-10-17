import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760575961295 implements MigrationInterface {
  name = 'Reviews1760575961295'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review_reply\` DROP COLUMN \`createdAt\``)
    await queryRunner.query(`ALTER TABLE \`review_reply\` ADD \`publishedAt\` timestamp NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review_reply\` DROP COLUMN \`publishedAt\``)
    await queryRunner.query(
      `ALTER TABLE \`review_reply\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    )
  }
}
