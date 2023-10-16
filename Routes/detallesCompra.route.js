const express = require('express');
const router = express();

const { getDetallesCompras,
    createDetalleCompra, deleteDetalleCompra} = require('../Controllers/detallesCompra.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getDetallesCompras);
router.post('/createDetalle',createDetalleCompra);
router.post('/deletedetallecompra',deleteDetalleCompra); 

module.exports = router;