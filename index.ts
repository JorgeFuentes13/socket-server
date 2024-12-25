import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from "body-parser";
import cors from 'cors'


const server = new Server();


server.start( () =>{

//BodyParser

    server.app.use( bodyParser.urlencoded({ extended: true }) );
    server.app.use(bodyParser.json());
//CORS
    server.app.use( cors({ origin: true, credentials: true }))

    server.app.use('/', router);

    console.log(`Servidor corriendo en el puerto ${ server.port }`);
} )