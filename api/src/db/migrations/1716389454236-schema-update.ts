import { MigrationInterface, QueryRunner } from 'typeorm'

export class SchemaUpdate1716389454236 implements MigrationInterface {
  name = 'SchemaUpdate1716389454236'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`alias\` varchar(255) NOT NULL, \`sku\` varchar(255) NULL, \`price\` int NOT NULL, \`description\` text NULL, \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_afa492329cc228eb3fdd51d86f\` (\`alias\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`alias\` varchar(255) NOT NULL, \`description\` text NULL, \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_ef133f841a42f39ec1a75b96ce\` (\`alias\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`product_categories_category\` (\`productId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_342d06dd0583aafc156e076379\` (\`productId\`), INDEX \`IDX_15520e638eb4c46c4fb2c61c4b\` (\`categoryId\`), PRIMARY KEY (\`productId\`, \`categoryId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_categories_category\` ADD CONSTRAINT \`FK_342d06dd0583aafc156e0763790\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_categories_category\` ADD CONSTRAINT \`FK_15520e638eb4c46c4fb2c61c4b4\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_categories_category\` DROP FOREIGN KEY \`FK_15520e638eb4c46c4fb2c61c4b4\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_categories_category\` DROP FOREIGN KEY \`FK_342d06dd0583aafc156e0763790\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_15520e638eb4c46c4fb2c61c4b\` ON \`product_categories_category\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_342d06dd0583aafc156e076379\` ON \`product_categories_category\``
    )
    await queryRunner.query(`DROP TABLE \`product_categories_category\``)
    await queryRunner.query(`DROP INDEX \`IDX_ef133f841a42f39ec1a75b96ce\` ON \`category\``)
    await queryRunner.query(`DROP TABLE \`category\``)
    await queryRunner.query(`DROP INDEX \`IDX_afa492329cc228eb3fdd51d86f\` ON \`product\``)
    await queryRunner.query(`DROP TABLE \`product\``)
  }
}
