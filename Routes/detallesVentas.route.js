const express = require('express');
const router = express();

const { getDetallesVentas,
    createDetalleVentas, deleteDetalleVentas} = require('../Controllers/detallesVenta.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getDetallesVentas);
router.post('/createDetalle',createDetalleVentas);
router.post('/deletedetalleventa',deleteDetalleVentas); 

module.exports = router;