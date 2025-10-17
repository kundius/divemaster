import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760661120524 implements MigrationInterface {
  name = 'Reviews1760661120524'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review_reply\` DROP COLUMN \`comment\``)
    await queryRunner.query(`ALTER TABLE \`review_reply\` ADD \`comment\` text NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`review_reply\` DROP COLUMN \`comment\``)
    await queryRunner.query(`ALTER TABLE \`review_reply\` ADD \`comment\` varchar(255) NOT NULL`)
  }
}
