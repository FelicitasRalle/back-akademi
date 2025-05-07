const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//middleware para parsear JSON
app.use(express.json());

//conectar a mongo
connectDB();

//rutas
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`);
})