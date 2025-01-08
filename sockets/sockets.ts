import { Socket } from 'socket.io';
import socketIO from 'socket.io'
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();


export const conectarCliente = (cliente: Socket) => {

    const usuario = new Usuario( cliente.id );

    usuariosConectados.agregar(usuario);


}


export const desconectar = (cliente: Socket, io: socketIO.Server ) => {
    cliente.on('disconnect', () => {     
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id)

        io.emit('usuarios-activos', usuariosConectados.getLista())

    })
}

//Escuchar mensajes
export const mensaje = (cliente : Socket, io : socketIO.Server) => {

    cliente.on('newLocation', ( payload:  { cuerpo : string})=> {

        console.log('Mensaje recibido', payload);

        io.emit('newLocation', payload);

    });


    // cliente.on('configurar-usuario',(payload : { nombre: string }, callback: Function) => {

    //     console.log('nombre usuario', payload.nombre);

    //     callback({
    //         ok: true, 
    //         mensaje: `Usuario ${ payload.nombre }, configurado`,
    //     });

    // });

}

export const configurarUsuario = (cliente : Socket, io : socketIO.Server) => {

    cliente.on('configurar-usuario', ( payload: {nombre: string}, callback: Function )=> {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre )

        io.emit('usuarios-activos', usuariosConectados.getLista())

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre } configurado`
        })

        // io.emit('mensaje-nuevo', payload);

    });

}

export const ObtenerUsuarios = ( cliente : Socket, io : socketIO.Server ) => {

    cliente.on('obtener-usuarios', ( )=> {

        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista())

        // io.emit('mensaje-nuevo', payload);

    });



}
