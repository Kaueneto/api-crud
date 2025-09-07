import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados

//criar aplicacao express
const router = express.Router();

// rota principal da aplicação
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à tela LOGIN!");
});

export default router;
