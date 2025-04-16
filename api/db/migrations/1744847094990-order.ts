import { MigrationInterface, QueryRunner } from "typeorm";

export class Order1744847094990 implements MigrationInterface {
    name = 'Order1744847094990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\``);
        await queryRunner.query(`ALTER TABLE \`delivery\` DROP FOREIGN KEY \`FK_b37d51328f9ca210b573b19372c\``);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`delivery\` ADD CONSTRAINT \`FK_b37d51328f9ca210b573b19372c\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`delivery\` DROP FOREIGN KEY \`FK_b37d51328f9ca210b573b19372c\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\``);
        await queryRunner.query(`ALTER TABLE \`delivery\` ADD CONSTRAINT \`FK_b37d51328f9ca210b573b19372c\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
