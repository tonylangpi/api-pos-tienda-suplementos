const express = require('express');
const router = express();

const { getMarcas,
    createMarcas,
    updateMarcas,
    deleteMarcas} = require('../Controllers/marcas.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getMarcas);
router.post('/createMarca',createMarcas);
router.put('/updateMarca',updateMarcas); 
router.delete('/deleteMarca/:id', deleteMarcas);

module.exports = router;