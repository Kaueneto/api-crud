import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situations } from "../entity/Situations";
//importar o arquivo com as credenciais do banco de dados

//criar aplicacao express
const router = express.Router();

// rota principal da aplicação
router.get("/Situations", (req: Request, res: Response) => {
  res.send("Bem-vindo à tela de situações da rota!");
});

// criar a rota de post
router.post("/Situations", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const situationRepository = AppDataSource.getRepository(Situations);
    const newSituation = situationRepository.create(data);

    await situationRepository.save(newSituation);

    res.status(201).json({
      mensagem: "Nova situação criada com sucesso!",
      situation: newSituation,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar nova situação",
    });
  }
});

export default router;
