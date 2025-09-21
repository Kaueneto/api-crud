import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategory";

export class CreateProductCategorySeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("iniciando o seed para a tabela 'product_category'");

    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    const existingSituation = await productCategoryRepository.count();

    if (existingSituation > 0) {
      console.log(
        "A tabela 'product_category' já possui dados. Nenhuma alteração será realizada"
      );
      return;
    }

    const categoriasDosProdutos = [
      { name: "Eletronicos" },
      { name: "Roteadores" },
      { name: "Teclados" },
    ];

    await productCategoryRepository.save(categoriasDosProdutos);

    console.log("Seed concluído com sucesso: alterações cadastradas!");
  }
}
