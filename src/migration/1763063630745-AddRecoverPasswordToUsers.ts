import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecoverPasswordToUsers1763063630745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.addColumn('users', new TableColumn({
                    name:"recoverPassword",
                    type: "varchar",
                    isUnique: true,
                    isNullable: true,
        
                }));
                //ajustar a ordem da coluna
                await queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword VARCHAR(255) after password`);
                
    } 

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "recoverPassword");
    }

}
