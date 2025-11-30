import express, { Request, Response } from "express";
//importar o arquivo com as credenciais do banco de dados
import { AuthService } from "../services/AuthService";
//criar aplicacao express
//importar a biblioteca yup para validacao
import * as yup from "yup";
import nodemailer from "nodemailer";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import crypto from "crypto";
import { url } from "inspector";

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
  try {
    var data = req.body;

    const schema = yup.object().shape({
      urlRecoverPassword: yup.string().required("a url é obrigatoria!"),
      email: yup
        .string()
        .email("Formato de e-mail inválido")
        .required("O e-mail do usuário é obrigatório!"),
    });

    await schema.validate(data, { abortEarly: false });

    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({
      email: data.email,
    });

    if (!user) {
      res.status(404).json({ mensagem: "Usuário não encontrado" });
      return;
    }

    // gerar token
    user.recoverPassword = crypto.randomBytes(32).toString("hex");
    await userRepository.save(user);

    //CONFIGURAR E-MAIL
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   var message_content = {
  from: process.env.EMAIL_FROM,
  to: data.email,
  subject: "Recuperar Senha",
  text: `Prezado(a) ${user.name},
Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.
Clique ou copie o link para criar uma nova senha em nosso sistema:
${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}
Esta mensagem foi enviada a você pela empresa ${process.env.APP}.
Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
o preenchimento de senhas ou informações cadastrais.
`,

  // Conteúdo em HTML
  html: `
    <p>Prezado(a) <strong>${user.name}</strong>,</p>

    <p>Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.</p>

    <p>Clique no link para criar uma nova senha em nosso sistema:</p>
    <p>
      <a href="${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}">
        ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}
      </a>
    </p>

    <br>

    <p>Esta mensagem foi enviada a você pela empresa <strong>${process.env.APP}</strong>.</p>
    <p>
      Você está recebendo porque está cadastrado no banco de dados da empresa <strong>${process.env.APP}</strong>.
      Nenhum e-mail enviado pela empresa <strong>${process.env.APP}</strong> tem arquivos anexados ou solicita
      o preenchimento de senhas e informações cadastrais.
    </p>
  `,
};

    transporter.sendMail(message_content, function (err) {
      if (err) {
        console.log("Erro ao enviar email: ", err);
        res.status(500).json({
          mensagem: `E-mail nao enviado, tente novamente ou contate ${process.env.EMAIL_ADM}.`,
        });
        return;
      }

      res.status(200).json({
        mensagem: "E-mail enviado com sucesso! Verifique sua caixa de entrada.",
        urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
      });
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ mensagem: error.errors });
      return;
    }

    res.status(500).json({ mensagem: "Erro ao editar senha do usuário" });
  }
});

router.post("/validate-recover-password", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const schema = yup.object().shape({
      recoverPassword: yup.string().required("A chave é obrigatória!"),
      email: yup
        .string()
        .email("Formato de e-mail inválido")
        .required("O e-mail do usuário é obrigatório!"),
    });

    await schema.validate(data, { abortEarly: false });

    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({
      email: data.email,
      recoverPassword: data.recoverPassword,
    });

    if (!user) {
      res.status(404).json({ mensagem: "A chave de recuperação é inválida" });
      return;
    }

    res.status(200).json({
      message: "A chave pra recuperar senha é válida!",
    });

  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ mensagem: error.errors });
      return;
    }

    res.status(500).json({ mensagem: "Erro interno ao validar a chave" });
  }
});



router.put("/update-password", async (req: Request, res: Response) => {
  try {

const data = req.body;

    const schema = yup.object().shape({
      recoverPassword: yup.string().required("A chave é obrigatória!"),
      email: yup
        .string()
        .email("Formato de e-mail inválido")
        .required("O e-mail do usuário é obrigatório!"),
       password: yup
         .string()
         .required("A senha do usuário é obrigatória!")
         .min(6, "A senha deve conter pelo menos 6 caracteres."),
    });

    await schema.validate(data, { abortEarly: false });

    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({
      email: data.email,
      recoverPassword: data.recoverPassword,
    });

    if (!user) {
      res.status(404).json({ mensagem: "A chave de recuperação é inválida" });
      return;
    }

//atribuir valor nulo para a coluna/campo recoverPassword
    data.recoverPassowrd = null;


    //autalizar os dados do usuario

    userRepository.merge(user, data);
    //salvar as alteracoes no banco
    await userRepository.save(user);

    res.status(200).json({
      mensagem: "senha atualizada com sucesso!",
    })


} catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ mensagem: error.errors });
      return;
    }

    res.status(500).json({ mensagem: "Erro interno ao validar a chave" });
  }
});

export default router;
