const express = require('express');
const router = express();

const { getFacturasEncabezado,
    createFacturasEncabezado, deleteFacturasEncabezado} = require('../Controllers/encabezadosCompra.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all/:idEmpresa',getFacturasEncabezado);
router.post('/createFacturaEncabezado',createFacturasEncabezado);
router.delete('/deleteencabezado', deleteFacturasEncabezado);

module.exports = router;