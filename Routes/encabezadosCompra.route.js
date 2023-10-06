const express = require('express');
const router = express();

const { getFacturasEncabezado,
    createFacturasEncabezado} = require('../Controllers/encabezadosCompra.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getFacturasEncabezado);
router.post('/createFacturaEncabezado',createFacturasEncabezado);

module.exports = router;