import { MigrationInterface, QueryRunner } from 'typeorm'

export class SchemaUpdate1716307524992 implements MigrationInterface {
  name = 'SchemaUpdate1716307524992'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`role\` ADD \`scope\` json NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`role\` DROP COLUMN \`scope\``)
  }
}
