import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategory";
import { Products } from "../entity/products";
import { PaginationService } from "../services/PaginationService";
import { ProductSituation } from "../entity/ProductSituation";
const router = express.Router();
import * as yup from "yup";

/// deletar  produto pelo id
router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productRepository = AppDataSource.getRepository(Products);
    const product = await productRepository.findOneBy({
      id: parseInt(id),
    });

    if (!product) {
      res.status(404).json({
        mensagem: "produto não encontrado para exclusão",
      });
      return;
    }
    //remover os dados
    await productRepository.remove(product);

    res.status(200).json({
      mensagem: "produto removido com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao remover o produto",
    });
    return;
  }
});

router.post("/products", async (req: Request, res: Response) => {
  try {
    console.log("Dados recebidos:", req.body);
    const { name, productCategoryId, productSituationId } = req.body;

    const schema = yup.object().shape({
      name: yup
        .string()
        .required("o nome do produto é obrigatorio.")
        .min(3, "o nome do produto deve ter pelo menos 3 caracteres."),
      productCategoryId: yup
        .number()
        .typeError("o ID da categoria deve ser um numero.")
        .required("A categoria é obrigatória."),
      productSituationId: yup
        .number()
        .typeError("o ID da situação deve ser um numero.")
        .required("a situação é obrigatória."),
    });
    await schema.validate(req.body, { abortEarly: false });

    const productRepository = AppDataSource.getRepository(Products);
    const categoryRepository = AppDataSource.getRepository(ProductCategory);
    const situationRepository = AppDataSource.getRepository(ProductSituation);

    // Buscar as entidades relacionadas
    const category = await categoryRepository.findOneBy({
      id: productCategoryId,
    });
    const situation = await situationRepository.findOneBy({
      id: productSituationId,
    });

    if (!category || !situation) {
      return res.status(400).json({
        mensagem: "Categoria ou situação não encontrada",
      });
    }

    // Criar o produto com as relações corretas
    const newProduct = productRepository.create({
      name,
      categories: category,
      situations: situation,
    });

    await productRepository.save(newProduct);

    res.status(201).json({
      mensagem: "Novo produto criado com sucesso!",
      product: newProduct,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }

    res.status(500).json({
      mensagem: "Erro ao criar novo produto",
      error: (error as Error).message,
    });
  }
});

//buscar produto pelo id
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Products);
    const product = await productRepository.findOneBy({ id: parseInt(id) });

    if (!product)
      return res.status(404).json({
        mensagem: " produto não encontrado para o ID digitado",
      });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar produto pelo id ",
      error: (error as Error).message,
    });
  }
});

//listar todos os produtos
router.get("/products", async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Products);
    //   const categories = await productCategoryRepository.find();
    const page = Number(req.query.page) || 1;
    //definir o limite de registros por pagina
    const limit = Number(req.query.limit) || 10;

    const result = await PaginationService.paginate(
      productRepository,
      page,
      limit,
      { id: "DESC" }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar todos produtos" });
  }
});

router.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // nesse caso só temos "name" pra atualizar

    const productRepository = AppDataSource.getRepository(Products);

    const product = await productRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!product) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    if (name) product.name = name;

    const updatedProduct = await productRepository.save(product);

    res
      .status(200)
      .json({ mensagem: "Produto atualizado", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar produto" });
  }
});

export default router;
