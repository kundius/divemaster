import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1739064182869 implements MigrationInterface {
    name = 'Product1739064182869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`option_value\` DROP FOREIGN KEY \`FK_15f11407cf576587fa1f6a36b39\``);
        await queryRunner.query(`ALTER TABLE \`option_value\` ADD CONSTRAINT \`FK_15f11407cf576587fa1f6a36b39\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`option_value\` DROP FOREIGN KEY \`FK_15f11407cf576587fa1f6a36b39\``);
        await queryRunner.query(`ALTER TABLE \`option_value\` ADD CONSTRAINT \`FK_15f11407cf576587fa1f6a36b39\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
