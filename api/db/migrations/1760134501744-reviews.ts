import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760134501744 implements MigrationInterface {
  name = 'Reviews1760134501744'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_review_media\` (\`fileId\` int NOT NULL, \`reviewId\` int NOT NULL, \`rank\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`fileId\`, \`reviewId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`product_review_reply\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reviewId\` int NOT NULL, \`comment\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_15bda7e24ded71aa7467e07dc4\` (\`reviewId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`product_review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`advantages\` text NULL, \`flaws\` text NULL, \`comment\` text NULL, \`userId\` int NULL, \`productId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_media\` ADD CONSTRAINT \`FK_f50965553bbe2de14eb4fdeaa5a\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_media\` ADD CONSTRAINT \`FK_6044ba5f6ab9bc2b8259436c4ab\` FOREIGN KEY (\`reviewId\`) REFERENCES \`product_review\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_reply\` ADD CONSTRAINT \`FK_15bda7e24ded71aa7467e07dc41\` FOREIGN KEY (\`reviewId\`) REFERENCES \`product_review\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_reply\` ADD CONSTRAINT \`FK_19b31bc9f4290daba2f439033a4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review\` ADD CONSTRAINT \`FK_db21a1dc776b455ee83eb7ff88e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review\` ADD CONSTRAINT \`FK_06e7335708b5e7870f1eaa608d2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_review\` DROP FOREIGN KEY \`FK_06e7335708b5e7870f1eaa608d2\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review\` DROP FOREIGN KEY \`FK_db21a1dc776b455ee83eb7ff88e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_reply\` DROP FOREIGN KEY \`FK_19b31bc9f4290daba2f439033a4\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_reply\` DROP FOREIGN KEY \`FK_15bda7e24ded71aa7467e07dc41\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_media\` DROP FOREIGN KEY \`FK_6044ba5f6ab9bc2b8259436c4ab\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_review_media\` DROP FOREIGN KEY \`FK_f50965553bbe2de14eb4fdeaa5a\``
    )
    await queryRunner.query(`DROP TABLE \`product_review\``)
    await queryRunner.query(
      `DROP INDEX \`REL_15bda7e24ded71aa7467e07dc4\` ON \`product_review_reply\``
    )
    await queryRunner.query(`DROP TABLE \`product_review_reply\``)
    await queryRunner.query(`DROP TABLE \`product_review_media\``)
  }
}
