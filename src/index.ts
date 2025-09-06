//importar biblioteca express
import express from "express";
//importar variavies de ambiente
import dotenv from "dotenv";
//carregar as variaveis  do arquivo .env
dotenv.config();

//criar a aplicacao epress
const app = express();

//incluir os controllers
import login from "./controllers/login";

//criar as rotas

app.use("/", login);

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`
  );
});
