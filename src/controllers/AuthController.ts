import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados
import { AuthService } from "../services/AuthService";
//criar aplicacao express
const router = express.Router();

// // rota principal da aplicação
// router.get("/", (req: Request, res: Response) => {
//   res.send("Bem-vindo à tela LOGIN!");
// });
// // ****ctrl+k+ ctrl+u descomenta as linhas
// // ****ctrl+k+ ctrl+c comenta as linhas
router.post("/", async (req: Request, res: Response) => {

  try {
    //extrair email e senha do corpo da requisicao
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "email e senha sao obrigatorios!",
      })
      return;
    }
    // criar uma instancia do serviço de autenticacao
     const authService = new AuthService(); 
     //chaar o metodo login para validar as credencias e obter os dados do usuario
     const userData = await authService.login(email, password);
     //retornar a resposta de sucesso com os dados do usuario
    res.status(200).json({
      message: "Login realizado com sucesso!",
      user: userData,
    });
    return;


    }catch (error: any) {
      //retonrar erro em caso defalha
    res.status(401).json({
      message: error.message || "Erro ao realizar o login",
    });
    return;

  }
});

export default router;
