const express = require('express');
const router = express();

const { getMetodosPago,
    createMetodosPago,
    updateMetodosPago,
    changestatusMetodosPago,} = require('../Controllers/metodopago.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getMetodosPago);
router.post('/create',createMetodosPago);
router.put('/updatemetodoPago',updateMetodosPago); 
router.delete('/deletemetodoPago/:id', changestatusMetodosPago);

module.exports = router;