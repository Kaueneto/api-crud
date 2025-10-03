import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategory";
import { error } from "console";
import { Products } from "../entity/products";
import { PaginationService } from "../services/PaginationService";

const router = express.Router();

/// deletar a categoria do produto pelo id
router.delete(
  "/products/:id",
  async (req: Request, res: Response) => {
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
  }
);

//cria uma categoria de produto
//router.post("/products", async (req: Request, res: Response) => {
  //try {
    //const { name,productCategoryId, productSituationId  } = req.body;
//
    //const productRepository = AppDataSource.getRepository(Products);
//
    //// Criando o produto diretamente com os IDs (se a entidade Products aceitar IDs nas relações)
    //const newProduct = productRepository.create({
      //name,
      //productCategoryId,
      //productSituationId
//
    //});
//
    //await productRepository.save(newProduct);
//
    //res.status(201).json({
      //mensagem: "Novo produto criado com sucesso!",
      //product: newProduct,
    //});
  //} catch (error) {
    //res.status(500).json({
      //mensagem: "Erro ao criar novo produto",
      //error: (error as Error).message,
    //});
  //}
//});
//




//buscar categoria pelo id
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

//listar todos as categorias
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
    res
      .status(500)
      .json({ mensagem: "Erro ao listar todos produtos" });
  }
});

// Atualizar a categoria do produto
router.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // nesse caso só temos "name" pra atualizar

    const productRepository = AppDataSource.getRepository(Products);

    const product = await productRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!product) {
      return res.status(404).json({ mensagem: "Categoria não encontrada" });
    }

    if (name) product.name = name;

    const updatedProduct = await productRepository.save(product);

    res
      .status(200)
      .json({ mensagem: "Categoria atualizada", category: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro ao atualizar categoria" });
  }
});

export default router;
