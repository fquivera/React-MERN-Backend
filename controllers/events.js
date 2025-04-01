const {response, json} = require('express')
const Evento = require('../models/Evento')


const getEventos = async (req, res=response) => {

    const eventos = await Evento.find().populate('user', 'name')

    res.json(
        {
            ok: true,
            eventos
        }
    )

}

const crearEvento = async (req, res=response) => {

    const evento = new Evento( req.body )

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save()

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: "Por favor comuniquese con el administrador del servidor..."
        })
        
    }

}

const actualizarEvento = async (req, res=response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Este evento no existe"
            })
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "No esta autorizado a cambiar este evento"
            })
        }

        const nuevoEvento = { ...req.body, user: req.uid}
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

        res.json(
        {
            ok: true,
            evento: eventoActualizado
        }
    )

        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: "Por favor comuniquese con el administrador del servidor..."
        })
        
    }

}

const borrarEvento = async (req, res = response) => {
    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Este evento no existe"
            })
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: "No esta autorizado para eliminar este evento"
            })
        }

        const eventoActualizado = await Evento.findOneAndDelete(eventoId)

        res.json(
        {
            ok: true,
            msg: `Se ha eliminado correctamente el evento ${eventoId}` ,
            evento: eventoActualizado
        }
    )

        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: "Por favor comuniquese con el administrador del servidor..."
        })
        
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    borrarEvento
}