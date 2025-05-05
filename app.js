const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middleware para parsear JSON
app.use(express.json());

//conectar a mongo
connectDB();

//rutas
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
})