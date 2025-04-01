const express = require('express');
require('dotenv').config();
var cors = require('cors')
const { dbConection } = require('./database/config')


// Crear el servidor express
const app = express();

// CORS
app.use(cors())

// Base de Datos
dbConection()

//Directorio público
app.use(express.static('public'));

// Lectura y Parseo del Body
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});