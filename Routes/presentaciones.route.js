const express = require('express');
const router = express();

const { getPresentaciones,
    createPresentaciones,
    updatePresentaciones,
    deletePresentaciones} = require('../Controllers/presentaciones.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getPresentaciones);
router.post('/createPresentacion',createPresentaciones);
router.put('/updatePresentacion',updatePresentaciones); 
router.delete('/deletePresentacion/:id', deletePresentaciones);

module.exports = router;