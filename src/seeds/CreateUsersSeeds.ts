import { DataSource } from "typeorm";
import { Users } from "../entity/Users";
import { Situations } from "../entity/Situations";

export class CreateUsersSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'users'");

    const usersRepository = dataSource.getRepository(Users);
    const situationsRepository = dataSource.getRepository(Situations);

    const existingUsers = await usersRepository.count();
    if (existingUsers > 0) {
      console.log(
        "A tabela 'users' já possui dados. Nenhuma alteração será realizada"
      );
      return;
    }

    // pega a situação com id 1
    const situation = await situationsRepository.findOneBy({ id: 1 });
    if (!situation) {
      throw new Error("Situação com ID 1 não encontrada. Crie antes.");
    }

    //tem que importar a sitaucao do usuario tambem, relacao entre as tabelas de ManyTo1
    const dataUsers = [
      {
        name: "Admin",
        email: "AdminKaue@gmail.com",
        situation: situation,
      },
    ];

    await usersRepository.save(dataUsers);

    console.log("Seed concluído com sucesso: alterações cadastradas!");
  }
}
