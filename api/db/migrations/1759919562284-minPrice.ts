import { MigrationInterface, QueryRunner } from 'typeorm'

export class MinPrice1759919562284 implements MigrationInterface {
  name = 'MinPrice1759919562284'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` ADD \`minPrice\` int(11) NULL`)
    await queryRunner.query(
      `CREATE INDEX \`IDX_83ba519803e18b965fd80f1b51\` ON \`product\` (\`minPrice\`)`
    )
    await queryRunner.query(`
      UPDATE "product"
      SET "minPrice" = (
        SELECT MIN("price")
        FROM "offer"
        WHERE "offer"."productId" = "product"."id"
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`minPrice\``)
  }
}
