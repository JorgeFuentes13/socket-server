
import express from 'express'
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server {

    private static _intance: Server;

    public app: express.Application ;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT
        this.httpServer = new http.Server( this.app );
        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } );
        
        this.escucharSockets();
    }

    public static get instance(){
        return this._intance || ( this._intance = new this() )
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets')

        this.io.on('connection', cliente =>{

            //Conectar cliente
            socket.conectarCliente( cliente );

            //Configurar usuario
            socket.configurarUsuario(cliente,this.io);

            //Obtener usuarios activos
            socket.ObtenerUsuarios(cliente,this.io);
            
            // console.log('Cliente conectado');
            
            //Mensajes
            socket.mensaje(cliente, this.io );

            // Desconectar
            socket.desconectar( cliente, this.io );
        })
        
    }

    start( callback : Function ){

        this.httpServer.listen( this.port, callback() );

    }

}