import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituation";

export class CreateProductSituationSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("iniciando o seed para a tabela 'product_situations'");

    const prodcutSituationRepository =
      dataSource.getRepository(ProductSituation);

    const existingSituation = await prodcutSituationRepository.count();

    if (existingSituation > 0) {
      console.log(
        "A tabela 'product_situations' já possui dados. Nenhuma alteração será realizada"
      );
      return;
    }

    const situacoesDosProdutos = [
      { name: "Descontinuado" },
      { name: "Esgotado" },
      { name: "Disponível" },
    ];

    await prodcutSituationRepository.save(situacoesDosProdutos);

    console.log("Seed concluído com sucesso: alterações cadastradas!");
  }
}
