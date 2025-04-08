import { CartProductOption } from '@/cart/entities/cart-product-option.entity'
import { CartProduct } from '@/cart/entities/cart-product.entity'
import { OfferOption } from '@/products/entities/offer-option.entity'
import { Offer } from '@/products/entities/offer.entity'
import { OptionValue } from '@/products/entities/option-value.entity'
import { ProductOption } from '@/products/entities/product-option.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Options1743809813295 implements MigrationInterface {
  name = 'Options1743809813295'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_option\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`rank\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`product_option\` ADD CONSTRAINT \`FK_2ca1aab0a82e9c0058d8465ad02\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )

    const optionValues = await queryRunner.manager.find(OptionValue, {
      relations: { option: true }
    })
    for (const optionValue of optionValues) {
      await queryRunner.manager.insert(ProductOption, {
        content: optionValue.content,
        name: optionValue.option.key,
        productId: optionValue.productId
      })
    }

    await queryRunner.query(
      `CREATE TABLE \`offer_option\` (\`id\` int NOT NULL AUTO_INCREMENT, \`offerId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`offer_option\` ADD CONSTRAINT \`FK_5aea0ac882ccd151f4f5dcb0b17\` FOREIGN KEY (\`offerId\`) REFERENCES \`offer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )

    const offers = await queryRunner.manager.find(Offer, {
      relations: {
        optionValues: {
          option: true
        }
      }
    })
    for (const offer of offers) {
      for (const optionValue of offer.optionValues) {
        await queryRunner.manager.insert(OfferOption, {
          content: optionValue.content,
          name: optionValue.option.key,
          offerId: offer.id
        })
      }
    }

    await queryRunner.query(
      `CREATE TABLE \`cart_product_option\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cartProductId\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`cart_product_option\` ADD CONSTRAINT \`FK_3d4c7c0ea21ee6792332dc371cb\` FOREIGN KEY (\`cartProductId\`) REFERENCES \`cart_product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )

    const cartProducts = await queryRunner.manager.find(CartProduct, {
      relations: {
        optionValues: {
          option: true
        }
      }
    })
    for (const cartProduct of cartProducts) {
      for (const optionValue of cartProduct.optionValues) {
        await queryRunner.manager.insert(CartProductOption, {
          content: optionValue.content,
          name: optionValue.option.key,
          cartProductId: cartProduct.id
        })
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart_product_option\` DROP FOREIGN KEY \`FK_3d4c7c0ea21ee6792332dc371cb\``
    )
    await queryRunner.query(
      `ALTER TABLE \`product_option\` DROP FOREIGN KEY \`FK_2ca1aab0a82e9c0058d8465ad02\``
    )
    await queryRunner.query(
      `ALTER TABLE \`offer_option\` DROP FOREIGN KEY \`FK_5aea0ac882ccd151f4f5dcb0b17\``
    )

    await queryRunner.query(`DROP TABLE \`cart_product_option\``)
    await queryRunner.query(`DROP TABLE \`product_option\``)
    await queryRunner.query(`DROP TABLE \`offer_option\``)
  }
}
