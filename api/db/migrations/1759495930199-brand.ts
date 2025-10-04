import { MigrationInterface, QueryRunner } from 'typeorm'

export class Brand1759495930199 implements MigrationInterface {
  name = 'Brand1759495930199'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`brand\` ADD \`alias\` varchar(255) NULL`)
    await queryRunner.query(`ALTER TABLE \`brand\` ADD \`imageId\` int NULL`)
    await queryRunner.query(`ALTER TABLE \`brand\` RENAME COLUMN \`title\` TO \`name\``)
    await queryRunner.query(
      `ALTER TABLE \`brand\` ADD CONSTRAINT \`FK_062524ac7f03786e461134ea624\` FOREIGN KEY (\`imageId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`brand\` DROP FOREIGN KEY \`FK_062524ac7f03786e461134ea624\``
    )
    await queryRunner.query(`ALTER TABLE \`brand\` RENAME COLUMN \`name\` TO \`title\``)
    await queryRunner.query(`ALTER TABLE \`brand\` DROP COLUMN \`imageId\``)
    await queryRunner.query(`ALTER TABLE \`brand\` DROP COLUMN \`alias\``)
  }
}
