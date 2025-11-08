//importar a conexao com o banco de dados
import { AppDataSource } from "../data-source";
//importar a entidade
import { Users } from "../entity/Users";
//classe responsavel pela autenticacao do usuario
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export class AuthService {

    private userRepository = AppDataSource.getRepository(Users);
    /**
     * Metodo para autenticar um usuario com email e senha
     * @param email - email do usuario
     * @param password - senha do usuario 
     * @returns Dados do usuario autenticado e token de acesso
     * @throws Erro caso as credenciais sejam invalidas
     */
    async login(email: string, password: string): Promise<{id: number; name: string; email: string; token: string}> {
        // bsucar o usuario no banco de dados pelo email 
        const user = await this.userRepository.findOne({where: {email}});

        // se o usuario nao for enconttrado, lançar erro
        if(!user){
            throw new Error("Usuario ou senha invalidos");

        }
        //verificar se a senha ifnormada corresponde a senha armazenada no banco
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            throw new Error("Usuario ou senha invalidos");
        }
        // gerar um token jwt para o usuario autenticado

        //o token inclui o id do usuario e expira em sete dias
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, { expiresIn: "7d"})
        

        //retornar os dados do usuario autenticado junto com o token gerado 
        return {id: user.id,name: user.name, email: user.email, token};
    }
}
