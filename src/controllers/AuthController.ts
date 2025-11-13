import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados
import { AuthService } from "../services/AuthService";
//criar aplicacao express
//importar a biblioteca yup para validacao
import * as yup from "yup";

import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import crypto from "crypto";

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

router.post("/recover-password", async (req: Request, res: Response) => {

  try{
   var data = req.body;

    const schema = yup.object().shape({
      urlRecoverPassword: yup
        .string()
        .required("a url é obrigatoria!"),
      email: yup
        .string()
        .email("Formato de e-mail inválido")
        .required("O e-mail do usuário é obrigatório!"),

    });

    await schema.validate(data, { abortEarly: false });
    //criar uma instancia no repositorio do user
    const userRepository = AppDataSource.getRepository(Users);
    //recuperar o registro do banco de dados com o valor da coluna email
    const user = await userRepository.findOneBy({
      email: data.email
    })
    if (!user) {
      res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
      return;
    }
    //gerar um token seguro de 64 caracteres
    user.recoverPassword = crypto.randomBytes(32).toString("hex");

    await userRepository.save(user);

    res.status(200).json({
      mensagem: "link para recuperação de senha gerado com sucesso!",
      urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
      key: user.recoverPassword,
    });


 } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({
        mensagem: error.errors,
      });
      return;
    }
    res.status(500).json({ mensagem: "Erro ao editar senha do usuário" });
  }
});




export default router;
