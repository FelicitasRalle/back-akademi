const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No autorizado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        req.user = user; 
        console.log('User from token:', req.user);  // Verifica el valor de req.user
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.rol !== "admin") {
        return res.status(403).json({ message: "Acceso solo para administradores" });
    }
    next();
};

module.exports = { protect, adminOnly };

