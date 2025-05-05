//conexion a mongo
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("conectado correctamente a mongo atlas");
    }catch (error){
        console.error("error al conectarse a mongo atlas", error.message);
    }
};

module.exports = connectDB;