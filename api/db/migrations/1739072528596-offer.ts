import { MigrationInterface, QueryRunner } from "typeorm";

export class Offer1739072528596 implements MigrationInterface {
    name = 'Offer1739072528596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer_option_values\` DROP FOREIGN KEY \`FK_6602b912631112245b7e7f638a8\``);
        await queryRunner.query(`ALTER TABLE \`offer_option_values\` ADD CONSTRAINT \`FK_6602b912631112245b7e7f638a8\` FOREIGN KEY (\`optionValueId\`) REFERENCES \`option_value\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer_option_values\` DROP FOREIGN KEY \`FK_6602b912631112245b7e7f638a8\``);
        await queryRunner.query(`ALTER TABLE \`offer_option_values\` ADD CONSTRAINT \`FK_6602b912631112245b7e7f638a8\` FOREIGN KEY (\`optionValueId\`) REFERENCES \`option_value\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
