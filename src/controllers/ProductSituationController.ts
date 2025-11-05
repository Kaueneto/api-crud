import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituation";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup";
import { Not } from "typeorm";
const router = express.Router();

/// deletar a situacao do produto pelo id
router.delete(
  "/product_situations/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const productSitutationRepository =
        AppDataSource.getRepository(ProductSituation);
      const situation = await productSitutationRepository.findOneBy({
        id: parseInt(id),
      });

      if (!situation) {
        res.status(404).json({
          mensagem: "Situação de produto não encontrada para exclusão",
        });
        return;
      }
      await productSitutationRepository.remove(situation);

      res.status(200).json({
        mensagem: "Situação do produto removido com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        mensagem: "Erro ao remover a situação de produto.",
      });
      return;
    }
  }
);

//cria uma situação de produto

router.post("/product_situations", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const schema = yup.object().shape({
      name: yup
        .string()
        .required("o campo nome da situação de produto é obrigatório!")
        .min(
          3,
          "o campo nome da situação de produto deve conter no minimo 3 caracteres!"
        ),
    });

    await schema.validate(data, { abortEarly: false });

    const situationRepository = AppDataSource.getRepository(ProductSituation);

    //valida duplicidade
    const existingSituation = await situationRepository.findOne({
      where: { name: data.name },
    });
    if (existingSituation) {
      res.status(400).json({
        mensagem: "uma situação com esse nome ja existe.",
      });
      return;
    }

    const newSituation = situationRepository.create(data);
    await situationRepository.save(newSituation);

    res.status(201).json({
      mensagem: "Nova situação de produto criada com sucesso!",
      situation: newSituation,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }

    res.status(500).json({
      mensagem: "Erro ao criar nova situação de produto",
      error: (error as Error).message,
    });
  }
});

//buscar situacao pelo id
router.get("/product_situations/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const situationRepository = AppDataSource.getRepository(ProductSituation);
    const situation = await situationRepository.findOneBy({ id: parseInt(id) });

    if (!situation)
      return res.status(404).json({
        mensagem: "Situacao de produto não encontrada para o ID digitado",
      });
    res.status(200).json(situation);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar a situacao de produto pelo id ",
      error: (error as Error).message,
    });
  }
});

//listar todos as situacoes
router.get("/product_situations", async (req: Request, res: Response) => {
  try {
    const productSitutationRepository =
      AppDataSource.getRepository(ProductSituation);
    //const situations = await productSitutationRepository.find();
    const page = Number(req.query.page) || 1;
    //definir o limite de registros por pagina
    const limit = Number(req.query.limit) || 10;

    const result = await PaginationService.paginate(
      productSitutationRepository,
      page,
      limit,
      { id: "DESC" }
    );

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao listar todas as situações de produtos" });
  }
});

// Atualizar a situacao do produto
router.put("/product_situations/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
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

    const situationRepository = AppDataSource.getRepository(ProductSituation);

    const situation = await situationRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!situation) {
      return res.status(404).json({ mensagem: "Situação não encontrada" });
    }

    //valida duplicidade
    const existingProductsituation = await situationRepository.findOne({
      where: {
        name: req.body.name,
        id: Not(parseInt(id)),
      },
    });

    if (existingProductsituation) {
      res.status(400).json({
        mensagem: "Já existe outra situação cadastrada com este nome.",
      });
      return;
    }

    if (name) situation.name = name;

    const updateSitu = await situationRepository.save(situation);

    res
      .status(200)
      .json({ mensagem: "Situação atualizada", situation: updateSitu });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar situação de produto" });
  }
});

export default router;
