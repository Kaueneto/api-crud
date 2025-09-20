import "reflect-metadata";

//importar biblioteca express
import express from "express";
//importar variavies de ambiente
import dotenv from "dotenv";
//carregar as variaveis  do arquivo .env
dotenv.config();

//criar a aplicacao epress
const app = express();

//cirar um middleware
app.use(express.json());

//incluir os controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import { Users } from "./entity/Users";
import UsersController from "./controllers/UsersController";
import ProductCategoryController from "./controllers/ProductCategoryController";
import ProductSituationController from "./controllers/ProductSituationController";
//criar as rotas

app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", UsersController);
app.use("/", ProductCategoryController);
app.use("/", ProductSituationController);
app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`
  );
});
