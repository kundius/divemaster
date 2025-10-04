import { MigrationInterface, QueryRunner } from 'typeorm'

export class Brand1759497164710 implements MigrationInterface {
  name = 'Brand1759497164710'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`brand\` ADD \`description\` text NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`brand\` DROP COLUMN \`description\``)
  }
}
