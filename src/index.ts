//importar biblioteca express
import express, {Response, Request} from "express";
//criar a aplicacao epress
const app = express()


app.get("/", (req: Request, res: Response) => {
    
 res.send("Hello World!")
})

app.listen(8080, ()=>{
    console.log("Servidort iniciado na porta 8080: http://localhost:8080")
})



