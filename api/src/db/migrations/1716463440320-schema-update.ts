import { MigrationInterface, QueryRunner } from 'typeorm'

export class SchemaUpdate1716463440320 implements MigrationInterface {
  name = 'SchemaUpdate1716463440320'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`file\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`hash\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`metadata\` json NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`product_image\` (\`fileId\` int NOT NULL, \`productId\` int NOT NULL, \`rank\` int NOT NULL DEFAULT '0', \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`fileId\`, \`productId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_2f757f675fce1f6fdda0cf0ca1f\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_2f757f675fce1f6fdda0cf0ca1f\``
    )
    await queryRunner.query(`DROP TABLE \`product_image\``)
    await queryRunner.query(`DROP TABLE \`file\``)
  }
}
