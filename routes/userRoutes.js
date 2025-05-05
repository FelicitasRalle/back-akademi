//ruta del usuario
const express = require('express');
const router = express.Router();

//luego voy a importar los controladores a medida q los cree

router.get('/', (req,  res)=>{
    res.send('la ruta de usuarios esta funcionando');
});

module.exports = router;