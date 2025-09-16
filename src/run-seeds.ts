import { AppDataSource } from "./data-source";
import { CreateSituationSeeds } from "./seeds/CreateSituationSeeds"; // repare nas { }

const runSeeds = async () => {
  console.log("conectando ao banco de dados(seeds)...");
  await AppDataSource.initialize();
  console.log("Banco de dados conectado!");

  try {
    const situationsSeed = new CreateSituationSeeds();
    await situationsSeed.run(AppDataSource);
  } catch (error) {
    console.error("Erro ao executar os seeds:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Conexão com o banco de dados encerrada.");
  }
};
runSeeds();
