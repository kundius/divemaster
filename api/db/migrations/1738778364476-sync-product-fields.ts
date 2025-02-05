import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncProductFields1738778364476 implements MigrationInterface {
    name = 'SyncProductFields1738778364476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`remoteId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`sku\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`categories\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`images\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`brand\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`favorite\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`recent\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`options\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD \`offers\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP FOREIGN KEY \`FK_341dcd0d68ca480cc1480dc00a4\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` CHANGE \`syncTaskId\` \`syncTaskId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD CONSTRAINT \`FK_341dcd0d68ca480cc1480dc00a4\` FOREIGN KEY (\`syncTaskId\`) REFERENCES \`sync_task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP FOREIGN KEY \`FK_341dcd0d68ca480cc1480dc00a4\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` CHANGE \`syncTaskId\` \`syncTaskId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` ADD CONSTRAINT \`FK_341dcd0d68ca480cc1480dc00a4\` FOREIGN KEY (\`syncTaskId\`) REFERENCES \`sync_task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`offers\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`options\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`recent\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`favorite\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`brand\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`images\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`categories\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`sku\``);
        await queryRunner.query(`ALTER TABLE \`sync_product\` DROP COLUMN \`remoteId\``);
    }

}
