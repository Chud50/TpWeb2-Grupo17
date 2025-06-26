import express, { Router } from 'express';
import cors from 'cors';

interface Options {
    port: number;
    routes:Router
}

export class Server {

    private app = express()

    private readonly port:number;
    private readonly routes:Router;

    constructor(options:Options){
        const {port,routes} = options
        this.port = port 
        this.routes = routes
    }

    async start() {

        this.app.use(express.json())
        this.app.use(express.urlencoded({extended : true}))

        // Configurar CORS para permitir peticiones desde Angular
        this.app.use(cors({
            origin: ['http://localhost:4200', 'http://localhost:51372'],
            credentials: true
        }))

        this.app.use(this.routes);

        this.app.listen(this.port, ()=>{
            console.log("Servidor corriendo en el puerto " + this.port);
        })
     }
}
