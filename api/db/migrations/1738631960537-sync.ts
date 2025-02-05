import { MigrationInterface, QueryRunner } from "typeorm";

export class Sync1738631960537 implements MigrationInterface {
    name = 'Sync1738631960537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sync_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`syncTaskId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sync_task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` enum ('initialization', 'synchronization', 'suspended', 'cancelled', 'success', 'error') NOT NULL, \`statusMessage\` varchar(255) NULL, \`provider\` enum ('archive') NOT NULL, \`total\` int NOT NULL DEFAULT '0', \`offset\` int NOT NULL DEFAULT '0', \`created\` int NOT NULL DEFAULT '0', \`updated\` int NOT NULL DEFAULT '0', \`skipped\` int NOT NULL DEFAULT '0', \`properties\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD CONSTRAINT \`FK_341dcd0d68ca480cc1480dc00a4\` FOREIGN KEY (\`syncTaskId\`) REFERENCES \`sync_task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP FOREIGN KEY \`FK_341dcd0d68ca480cc1480dc00a4\``);
        await queryRunner.query(`DROP TABLE \`sync_task\``);
        await queryRunner.query(`DROP TABLE \`sync_product\``);
    }

}
