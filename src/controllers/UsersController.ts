import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Situations } from "../entity/Situations";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup";
import { Not } from "typeorm";
const router = express.Router();

// Listar todos os usuários
router.get("/users", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(Users);
    //receber o numero de pagina e definir 1 como padrao
    const page = Number(req.query.page) || 1;
    //define o limite de registros por pagina
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
      name: yup.string().required("o nome do usuario é obrigatório!").min(3, "o nome do usuario deve conter no minimo 3 caracteres!"),
      email: yup.string().email("formato de email inválido").required("o email do usuario é obrigatório!"),
      password: yup.string().required("a senha do usuario é obrigatoria!").min(6, "a senha deve conter pelo menos 6 caracteres."),
      situation: yup.number().required("a situação do usuario é obrigatória!"),
      
    });

    await schema.validate(req.body, { abortEarly: false });

    const situationRepository = AppDataSource.getRepository(Situations);
    const userRepository = AppDataSource.getRepository(Users);

    //valida duplicidade do nome
    const existingUserName = await userRepository.findOne({
      where: { name: req.body.name },
    });
    if (existingUserName) {
      res.status(400).json({
        mensagem: "um usuario com esse nome ja existe.",
      });
      return;
    }

    //valida duplicidade do email
    const existingUserEmail = await userRepository.findOne({
      where: { email: req.body.email },
    });
    if (existingUserEmail) {
      res.status(400).json({
        mensagem: "este email ja esta cadastrado para outro usuario.",
      });
      return;
    }

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

    const schema = yup.object().shape({
      name: yup
        .string()
        .required("o campo nome é obrigatório!")
        .min(
          3,
          "o campo nome deve conter no minimo 3 caracteres pra atualizacao!"
        ),
    });
    await schema.validate(req.body, { abortEarly: false });

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
    //valida duplicidade
    const existingUser = await userRepository.findOne({
      where: {
        name: req.body.name,
        id: Not(parseInt(id)),
      },
    });

    if (existingUser) {
      res.status(400).json({
        mensagem: "Já existe outra situação cadastrada com este nome.",
      });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    const updatedUser = await userRepository.save(user);

    res.status(200).json({ mensagem: "Usuário atualizado", user: updatedUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }
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
