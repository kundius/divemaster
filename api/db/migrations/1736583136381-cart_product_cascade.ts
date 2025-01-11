import { MigrationInterface, QueryRunner } from "typeorm";

export class CartProductCascade1736583136381 implements MigrationInterface {
    name = 'CartProductCascade1736583136381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_139f8024067696fe5a8400ebda2\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_4f1b0c66f4e0b4610e14ca42e5c\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_139f8024067696fe5a8400ebda2\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_4f1b0c66f4e0b4610e14ca42e5c\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_4f1b0c66f4e0b4610e14ca42e5c\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` DROP FOREIGN KEY \`FK_139f8024067696fe5a8400ebda2\``);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_4f1b0c66f4e0b4610e14ca42e5c\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_product\` ADD CONSTRAINT \`FK_139f8024067696fe5a8400ebda2\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
