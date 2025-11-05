import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategory";
import { error } from "console";
import { Products } from "../entity/products";
import { PaginationService } from "../services/PaginationService";
import * as yup from "yup";
const router = express.Router();

/// deletar a categoria do produto pelo id
router.delete(
  "/product_categories/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const productRepository = AppDataSource.getRepository(ProductCategory);
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
  }
);

//cria uma categoria de produto

router.post("/product_categories", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const schema = yup.object().shape({
      name: yup
        .string()
        .required("o nome da categoria do produto é obrigatorio.")
        .min(
          3,
          "o nome da categoria do produto deve ter pelo menos 3 caracteres"
        ),
    });

    await schema.validate(data, { abortEarly: false });

    const categoryRepository = AppDataSource.getRepository(ProductCategory);
    const newCategory = categoryRepository.create(data);
    await categoryRepository.save(newCategory);

    res.status(201).json({
      mensagem: "Nova categoria de produto criada com sucesso!",
      category: newCategory,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }
    res.status(500).json({
      mensagem: "Erro ao criar nova categoria de produto",
      error: (error as Error).message,
    });
  }
});

//buscar categoria pelo id
router.get("/product_categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(ProductCategory);
    const product = await productRepository.findOneBy({ id: parseInt(id) });

    if (!product)
      return res.status(404).json({
        mensagem: "Categoria de produto não encontrada para o ID digitado",
      });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar a categoria de produto pelo id ",
      error: (error as Error).message,
    });
  }
});

//listar todos as categorias
router.get("/product_categories", async (req: Request, res: Response) => {
  try {
    const productCategoryRepository =
      AppDataSource.getRepository(ProductCategory);
    //   const categories = await productCategoryRepository.find();
    const page = Number(req.query.page) || 1;
    //definir o limite de registros por pagina
    const limit = Number(req.query.limit) || 10;

    const result = await PaginationService.paginate(
      productCategoryRepository,
      page,
      limit,
      { id: "DESC" }
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao listar todas as categorias de produtos" });
  }
});

// Atualizar a categoria do produto
router.put("/product_categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // nesse caso só temos "name" pra atualizar

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

    const categoryRepository = AppDataSource.getRepository(ProductCategory);

    const category = await categoryRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!category) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    if (name) category.name = name;

    const updatedCategory = await categoryRepository.save(category);

    res
      .status(200)
      .json({ mensagem: "Categoria atualizada", category: updatedCategory });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar categoria" });
  }
});

export default router;
