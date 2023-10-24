const express = require('express');
const router = express();

const { getFacturasEncabezado,
    createFacturasEncabezadoVenta, deleteFacturasEncabezado,generarPdf} = require('../Controllers/encabezadosVenta.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all/:idEmpresa',getFacturasEncabezado);
router.post('/createFacturaEncabezado',createFacturasEncabezadoVenta);
router.delete('/deleteencabezado', deleteFacturasEncabezado);
router.get('/generarFactura', generarPdf); 

module.exports = router;