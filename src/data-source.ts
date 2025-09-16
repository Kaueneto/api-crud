import "reflect-metadata";
import { DataSource } from "typeorm";
const dialect = process.env.DB_DIALECT ?? "mysql";

import { Situations } from "./entity/Situations";
import { Users } from "./entity/Users";
import { ProductSituation } from "./entity/ProductSituation";
import { Products } from "./entity/products";
import { ProductCategory } from "./entity/ProductCategory";

//importar variavies de ambiente
import dotenv from "dotenv";
//carregar as variaveis  do arquivo .env
dotenv.config();

// carrega o .env do projeto
dotenv.config();

export const AppDataSource = new DataSource({
  type: dialect as "mysql" | "mariadb" | "postgres" | "mongodb",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [Situations, Users, ProductSituation, Products, ProductCategory],
  subscribers: [],
  migrations: [__dirname + "/migration/*.js"],
});
//inicializar conexao com bd

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.log("erro na conexao com o banco de dados!", error);
  });
