const express = require('express');
const router = express();

const { getSabores,
    createSabores,
    updateSabores,
    deleteSabores} = require('../Controllers/sabores.controller');

//rutas de CRUD sobre tabla presentciones
router.get('/all',getSabores);
router.post('/createSabor',createSabores);
router.put('/updateSabor',updateSabores); 
router.delete('/deleteSabor/:id', deleteSabores);

module.exports = router;