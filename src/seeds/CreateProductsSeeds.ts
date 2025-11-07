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


  const products = [
  productRepository.create({
    name: "curso de programacao web",
    slug: "curso-de-programacao-web",
    description: "Um curso completo de programação web, com front e back.",
    price: 199.99,
    situations: situationDisponivel,
    categories: category
  }),
  productRepository.create({
    name: "curso de design grafico",
    slug: "curso-de-design-grafico",
    description: "Aprenda os fundamentos do design gráfico e ferramentas de design.",
    price: 149.99,
    situations: descontinuadoSituation,
    categories: category
  }),
];

    await productRepository.save(products);

    console.log("Seed concluído com sucesso: produtos cadastrados!");
  }
}
