import { AppDataSource } from "./data-source";
import { CreateSituationSeeds } from "./seeds/CreateSituationSeeds";
import { CreateProductSituationSeeds } from "./seeds/CreateProductSituationSeeds";
import { CreateProductCategorySeeds } from "./seeds/CreateProductCategorySeeds";
import { CreateUsersSeeds } from "./seeds/CreateUsersSeeds";
import { CreateProductsSeeds } from "./seeds/CreateProductsSeeds";

const runSeeds = async () => {
  console.log("conectando ao banco de dados(seeds)...");
  await AppDataSource.initialize();
  console.log("Banco de dados conectado!");

  try {
    try {
      await new CreateSituationSeeds().run(AppDataSource);
      console.log("Seed de situações executada!");
    } catch (error) {
      console.error("Erro na seed de situações:", error);
    }

    try {
      await new CreateProductSituationSeeds().run(AppDataSource);
      console.log("Seed de situações de produto executada!");
    } catch (error) {
      console.error("Erro na seed de situações de produto:", error);
    }

    try {
      await new CreateProductCategorySeeds().run(AppDataSource);
      console.log("Seed de categorias de produto executada!");
    } catch (error) {
      console.error("Erro na seed de categorias de produto:", error);
    }

    try {
      await new CreateUsersSeeds().run(AppDataSource);
      console.log("Seed de usuários executada!");
    } catch (error) {
      console.error("Erro na seed de usuários:", error);
    }
try {
      await new CreateProductsSeeds().run(AppDataSource);
      console.log("Seed de produtos executada!");
    } catch (error) {
      console.error("Erro na seed de produtos:", error);
    }


  } finally {
    await AppDataSource.destroy();
    console.log("Conexão com o banco de dados encerrada.");
  }
};

runSeeds();
