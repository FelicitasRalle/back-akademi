const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middlewares a usar
app.use(cors());
app.use(express.json());

//conexion a mongo
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => console.log('Conectado correctamente a mongo'))
.catch(err => console.error('Error al querer conectarse a mongo'));

//ruta para probar la conexion
app.get('/', (req, res) => {
    res.send('api funciona correctamente');
});

//iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('servidor corriendo en ${PORT}')
});