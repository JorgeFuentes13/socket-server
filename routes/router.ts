import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/sockets';


const router = Router();


router.get('/mensajes', ( req: Request, res: Response ) => {

    res.json({
        ok: true,
        mensaje: 'Todo esttá bien!!'
    })



});


router.post('/mensajes', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = {
        cuerpo,
        de
    }


    const server = Server.instance
    server.io.emit('mensaje-nuevo',payload);

    res.json({
        ok: true,
        cuerpo,
        de,
    })

});

router.post('/mensajes/:id', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit('mensaje-privado',payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })

});


//Servicio para obtener todos los IDS de los usuarios.
router.get('/usuarios', async ( req: Request, res: Response ) => {

    const server = Server.instance
    await server.io.fetchSockets().then( (sockets)  =>{ 
        res.json({
            ok: true,
            //clientes
            clientes: sockets.map( clientes => clientes.id )
        });
    }).catch((error ) => {
        res.json({
            ok: false,
            error
        })
    })

    // try {
    //     const server = Server.instance;
    //     const clientes : string[] = [];
    //     const { sockets } = server.io.sockets;
    //     sockets.forEach( socket => {
    //         clientes.push(socket.id)
    //     });
    //     return res.json({
    //         ok: true,
    //         clientes
    //     });
    // } catch (error) {
    //     res.json({
    //         ok: false,
    //         error   
    //     });
    // }  
})

//Obtener usuarios y sus nombres
router.get('/usuarios/detalles', ( req: Request, res: Response ) => {


    res.json({
           ok: true,
            clientes: usuariosConectados.getLista()
     });

})


export default router;