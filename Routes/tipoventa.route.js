const express = require('express');
const router = express();

const { getTipoVenta,
    createTipoVenta,
    updateTipoVenta,
    deleteTipoVenta,} = require('../Controllers/tipoventa.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getTipoVenta);
router.post('/create',createTipoVenta);
router.put('/updatetipoVenta',updateTipoVenta); 
router.delete('/deletetipoVenta/:id', deleteTipoVenta);

module.exports = router;