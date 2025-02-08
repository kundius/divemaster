import { MigrationInterface, QueryRunner } from 'typeorm'

export class Sync1738859668178 implements MigrationInterface {
  name = 'Sync1738859668178'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sync_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remoteId\` varchar(255) NOT NULL, \`sku\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`categories\` text NOT NULL, \`images\` text NOT NULL, \`brand\` varchar(255) NOT NULL, \`favorite\` varchar(255) NOT NULL, \`recent\` varchar(255) NOT NULL, \`options\` text NOT NULL, \`offers\` text NOT NULL, \`syncTaskId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`sync_task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`status\` enum ('initialization', 'synchronization', 'success', 'error') NOT NULL, \`statusMessage\` varchar(255) NULL, \`total\` int NOT NULL DEFAULT '0', \`offset\` int NOT NULL DEFAULT '0', \`created\` int NOT NULL DEFAULT '0', \`updated\` int NOT NULL DEFAULT '0', \`skipped\` int NOT NULL DEFAULT '0', \`properties\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`sync_product\` ADD CONSTRAINT \`FK_341dcd0d68ca480cc1480dc00a4\` FOREIGN KEY (\`syncTaskId\`) REFERENCES \`sync_task\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sync_product\` DROP FOREIGN KEY \`FK_341dcd0d68ca480cc1480dc00a4\``
    )
    await queryRunner.query(`DROP TABLE \`sync_task\``)
    await queryRunner.query(`DROP TABLE \`sync_product\``)
  }
}
