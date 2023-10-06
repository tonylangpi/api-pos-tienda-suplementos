const express = require('express');
const router = express();

const { getDetallesCompras,
    createDetalleCompra} = require('../Controllers/detallesCompra.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getDetallesCompras);
router.post('/createDetalle',createDetalleCompra);

module.exports = router;