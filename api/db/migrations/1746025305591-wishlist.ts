import { MigrationInterface, QueryRunner } from 'typeorm'

export class Wishlist1746025305591 implements MigrationInterface {
  name = 'Wishlist1746025305591'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`wishlist\` (\`id\` varchar(36) NOT NULL, \`userId\` int NULL, \`type\` enum ('favourites', 'comparison', 'viewed') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`wishlist_products_product\` (\`wishlistId\` varchar(36) NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_d26d172812ffce61522237f3ae\` (\`wishlistId\`), INDEX \`IDX_f732d2ee0684d55dbead923860\` (\`productId\`), PRIMARY KEY (\`wishlistId\`, \`productId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`wishlist\` ADD CONSTRAINT \`FK_f6eeb74a295e2aad03b76b0ba87\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`wishlist_products_product\` ADD CONSTRAINT \`FK_d26d172812ffce61522237f3ae3\` FOREIGN KEY (\`wishlistId\`) REFERENCES \`wishlist\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`wishlist_products_product\` ADD CONSTRAINT \`FK_f732d2ee0684d55dbead923860c\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`wishlist_products_product\` DROP FOREIGN KEY \`FK_f732d2ee0684d55dbead923860c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`wishlist_products_product\` DROP FOREIGN KEY \`FK_d26d172812ffce61522237f3ae3\``
    )
    await queryRunner.query(
      `ALTER TABLE \`wishlist\` DROP FOREIGN KEY \`FK_f6eeb74a295e2aad03b76b0ba87\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_f732d2ee0684d55dbead923860\` ON \`wishlist_products_product\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_d26d172812ffce61522237f3ae\` ON \`wishlist_products_product\``
    )
    await queryRunner.query(`DROP TABLE \`wishlist_products_product\``)
    await queryRunner.query(`DROP TABLE \`wishlist\``)
  }
}
