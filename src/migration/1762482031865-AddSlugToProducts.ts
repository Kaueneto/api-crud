import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToProducts1762482031865 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('products', new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false,
        }));
        //ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE products MODIFY COLUMN slug VARCHAR(255) after name`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
        
    }

}
import { TableColumn } from "typeorm";