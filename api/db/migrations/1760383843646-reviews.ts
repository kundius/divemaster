import { MigrationInterface, QueryRunner } from 'typeorm'

export class Reviews1760383843646 implements MigrationInterface {
  name = 'Reviews1760383843646'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`review_media\` (\`fileId\` int NOT NULL, \`reviewId\` int NOT NULL, \`rank\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`fileId\`, \`reviewId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`review_reply\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reviewId\` int NOT NULL, \`comment\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_e1d78d98da06265aa0a85cee5f\` (\`reviewId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`advantages\` text NULL, \`flaws\` text NULL, \`comment\` text NULL, \`author\` text NULL, \`userId\` int NULL, \`productId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`recommend\` tinyint NOT NULL, \`rating\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`review_media\` ADD CONSTRAINT \`FK_2e51ad258a66bc01d35701653f4\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`review_media\` ADD CONSTRAINT \`FK_c7080089bc1d33a0e86e09d2fec\` FOREIGN KEY (\`reviewId\`) REFERENCES \`review\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`review_reply\` ADD CONSTRAINT \`FK_e1d78d98da06265aa0a85cee5f6\` FOREIGN KEY (\`reviewId\`) REFERENCES \`review\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`review_reply\` ADD CONSTRAINT \`FK_ca29bad469a69cf83ed183777cd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_2a11d3c0ea1b2b5b1790f762b9a\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_2a11d3c0ea1b2b5b1790f762b9a\``
    )
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``
    )
    await queryRunner.query(
      `ALTER TABLE \`review_reply\` DROP FOREIGN KEY \`FK_ca29bad469a69cf83ed183777cd\``
    )
    await queryRunner.query(
      `ALTER TABLE \`review_reply\` DROP FOREIGN KEY \`FK_e1d78d98da06265aa0a85cee5f6\``
    )
    await queryRunner.query(
      `ALTER TABLE \`review_media\` DROP FOREIGN KEY \`FK_c7080089bc1d33a0e86e09d2fec\``
    )
    await queryRunner.query(
      `ALTER TABLE \`review_media\` DROP FOREIGN KEY \`FK_2e51ad258a66bc01d35701653f4\``
    )
    await queryRunner.query(`DROP TABLE \`review\``)
    await queryRunner.query(`DROP INDEX \`REL_e1d78d98da06265aa0a85cee5f\` ON \`review_reply\``)
    await queryRunner.query(`DROP TABLE \`review_reply\``)
    await queryRunner.query(`DROP TABLE \`review_media\``)
  }
}
