/* 
 Rutas de Usuarios/ Auth
 Ruta: /api/auth
*/

const {Router} = require('express');
const router = Router();
const {check} = require('express-validator')

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El correo no es valido').isEmail(),
        check('password', 'Clave debe tener minimo 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario)

router.post(
    '/',
    [
      check('email', 'El correo no es valido').isEmail(),
      check('password', 'Clave debe tener minimo 6 caracteres').isLength({min:6}),
      validarCampos  
    ],
     loginUsuario)

router.get('/renew', validarJWT, revalidarToken)

module.exports = router;