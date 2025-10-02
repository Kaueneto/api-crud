import { DataSource } from "typeorm";
import { Products } from "../entity/products";  // Suponho que a entidade seja chamada 'Product'
import { ProductSituation } from "../entity/ProductSituation";
import { ProductCategory } from "../entity/ProductCategory";

export class CreateProductsSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'products'");

    const productRepository = dataSource.getRepository(Products);
    const productSituationRepository = dataSource.getRepository(ProductSituation);
    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      console.log(
        "A tabela 'products' já possui dados. Nenhuma alteração será realizada"
      );
      return;
    }


    const situationDisponivel = await productSituationRepository.findOneBy({ name: "Disponível" });
    const descontinuadoSituation = await productSituationRepository.findOneBy({ name: "Descontinuado" });
    const esgotadoSitu = await productSituationRepository.findOneBy({ name: "Esgotado" });

    const category = await productCategoryRepository.findOneBy({ name: "Teclados" });

    if (!situationDisponivel || !descontinuadoSituation || !esgotadoSitu || !category) {
      throw new Error("Alguma situação ou categoria não foi encontrada. Crie antes.");
    }


    const dataProducts = [
      {
        name: "Produto 1",
        situations: situationDisponivel,
        categories: category
      },
      {
        
        name: "fulano de tal",
        situations: descontinuadoSituation,
        categories: category
      }
    ];

    await productRepository.save(dataProducts);

    console.log("Seed concluído com sucesso: produtos cadastrados!");
  }
}
