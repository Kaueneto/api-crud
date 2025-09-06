import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source";
//import { error } from "console";

//criar aplicacao express
const router = express.Router();

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.log("erro na conexao com o banco de dados!", error);
  });

// rota principal da aplicação
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à tela LOGIN!");
});

export default router;
