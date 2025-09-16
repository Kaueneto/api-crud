import { DataSource } from "typeorm";
import { Situations } from "../entity/Situations";

export class CreateSituationSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("iniciando o seed para a tabela 'situations'");

    const situationRepository = dataSource.getRepository(Situations);

    const existingSituation = await situationRepository.count();

    if (existingSituation > 0) {
      console.log(
        "A tabela 'situations' já possui dados. Nenhuma alteração será realizada"
      );
      return;
    }

    const situations = [
      { nameSituation: "Ativo" },
      { nameSituation: "Inativo" },
      { nameSituation: "Pendente" },
    ];

    await situationRepository.save(situations);

    console.log("Seed concluído com sucesso: alterações cadastradas!");
  }
}
