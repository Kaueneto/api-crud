import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Situations } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup";
const router = express.Router();

// Listar todos os usuários
router.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(Users);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Usando o PaginationService
    const result = await PaginationService.paginate(
      userRepository,
      page,
      limit,
      { id: "DESC" }
      //["situation"]
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar usuários" });
  }
});

// Buscar usuário pelo ID
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["situation"],
    });

    if (!user)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar usuário" });
  }
});

// Criar novo usuário
router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, situationId } = req.body;

    const schema = yup.object().shape({
      name: yup
        .string()
        .required("o nome do usuario é obrigatório!")
        .min(3, "o nome do usuario deve conter no minimo 3 caracteres!"),
    });

    await schema.validate(req.body, { abortEarly: false });

    const situationRepository = AppDataSource.getRepository(Situations);
    const userRepository = AppDataSource.getRepository(Users);

    // Verifica se a situação existe
    const situation = await situationRepository.findOneBy({ id: situationId });
    if (!situation)
      return res.status(400).json({ mensagem: "Situação inválida" });

    // Cria o usuário
    const newUser = userRepository.create({ name, email, situation });
    await userRepository.save(newUser);

    res
      .status(201)
      .json({ mensagem: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }

    res.status(500).json({ mensagem: "Erro ao criar usuário" });
  }
});

// Atualizar usuário
router.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, situationId } = req.body;

    const userRepository = AppDataSource.getRepository(Users);
    const situationRepository = AppDataSource.getRepository(Situations);

    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    if (situationId) {
      const situation = await situationRepository.findOneBy({
        id: situationId,
      });
      if (!situation)
        return res.status(400).json({ mensagem: "Situação inválida" });
      user.situation = situation;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    const updatedUser = await userRepository.save(user);

    res.status(200).json({ mensagem: "Usuário atualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
});

// Remover usuário
router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    await userRepository.remove(user);

    res.status(200).json({ mensagem: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao remover usuário" });
  }
});

export default router;
