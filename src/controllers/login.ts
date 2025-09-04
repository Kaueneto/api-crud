import express, { Request, Response } from "express";
const router = express.Router();

// rota principal da aplicação
router.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo à tela LOGIN!");
});

export default router;
