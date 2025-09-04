//importar biblioteca express
import express from "express";
//criar a aplicacao epress
const app = express();

//incluir os controllers
import login from "./controllers/login";

//criar as rotas

app.use('/', login)



app.listen(8080, ()=>{
    console.log("Servidort iniciado na porta 8080: http://localhost:8080")
})

