const express = require('express');
const router = express();

const { getTipoCompras,
    createTipoCompra,
    updateTipoCompra} = require('../Controllers/tipocompra.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getTipoCompras);
router.post('/createTipoCompra',createTipoCompra);
router.put('/updateTipoCompra',updateTipoCompra); 
//router.delete('/deleteMarca/:id', deleteMarcas);

module.exports = router;