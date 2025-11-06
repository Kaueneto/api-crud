import "reflect-metadata";

//importar biblioteca express
import express from "express";
//importar variavies de ambiente
import dotenv from "dotenv";
//carregar as variaveis  do arquivo .env
dotenv.config();

//importar a biblioteca para permitir conexao eterna
import cors from "cors";

//criar a aplicacao epress
const app = express();

//cirar um middleware
app.use(express.json());
//criar o middleware para permitir a req externa
app.use(cors());

//incluir os controllers
import TestConnectionController from "./controllers/TestConnectionController";

import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import UsersController from "./controllers/UsersController";
import ProductCategoryController from "./controllers/ProductCategoryController";
import ProductSituationController from "./controllers/ProductSituationController";
import ProductController from "./controllers/ProductController";
//criar as rotas
app.use("/", TestConnectionController);
app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", UsersController);
app.use("/", ProductCategoryController);
app.use("/", ProductSituationController);
app.use("/", ProductController);
app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`
  );
});
