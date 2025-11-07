import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUsers1762444992867 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name:"password",
            type: "varchar",
            isNullable: false,

        }));
        //ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN password VARCHAR(255) after email`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password");
        
    }

}
