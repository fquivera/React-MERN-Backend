
const {response} = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/Usuarios')
const { generarJWT }=  require('../helpers/jwt')


const crearUsuario = async(req, res=response) => {

    const { email, password } = req.body


    try {
        let usuario = await Usuario.findOne({email})
        if (usuario) {
            return res.status(400).json({
                'ok': false,
                'msg': 'Ya existe un usuario con ese correo electrónico'
            })
        }
        usuario = new Usuario( req.body )

        // Cifrar la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save()

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)
    
        res.status(201).json(
            {
                'ok': true,
                'uid': usuario.id,
                'name': usuario.name,
                token
            }
        );
    } catch (error) {
        console.error(error)
        res.status(500).json(
            {
                'ok': false,
                'msg': 'Error en el servidor, comuniquese con el Administrador'
            }
        )
        
    }

}

const loginUsuario = async (req, res=response) => {

    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({email})
        if (!usuario) {
            return res.status(400).json({
                'ok': false,
                'msg': 'No existe un usuario con ese correo electrónico'
            })
        }

        // Confirmar el password
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                'ok': false,
                'msg': 'Password incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name)
        
        res.json(
            {
                'ok': true,
                'uid': usuario.id,
                'name': usuario.name,
                token
            }
        );
    } catch (error) {
        console.error(error)
        res.status(500).json(
            {
                'ok': false,
                'msg': 'Error en el servidor, comuniquese con el Administrador'
            }
        )
        
    }
};

const revalidarToken = async(req, res=response) => {

    const {uid, name} = req

    // Generar JWT
    const token = await generarJWT(uid, name)

    res.json(
        {
            'ok': true,
            uid,
            name,
            token
        }
    );
}

module.exports= {
    crearUsuario,
    loginUsuario,
    revalidarToken
}