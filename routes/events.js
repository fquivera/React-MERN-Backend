const {Router} = require('express');
const {check} = require('express-validator')

const { getEventos, crearEvento, borrarEvento, actualizarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const {isDate} = require('../helpers/isDate')

const router = Router();

// Todas las rutas deben ser validadas con JWT
router.use(validarJWT)


// Obtener eventos
router.get("/", getEventos)

// Crear un Evento
router.post(
    "/",
    [
        check('title', 'El titulo es obligatorio').notEmpty(),
        check('start', 'La fecha inicial es obligatoria').custom(isDate),
        check('end', 'La fecha final es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
)

// Actualizar Evento
router.put("/:id", actualizarEvento)

// Borrar evento
router.delete("/:id", borrarEvento)

module.exports = router