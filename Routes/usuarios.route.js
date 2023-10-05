const express = require('express');
const router = express();

const { getUsuarios, createUsuario, updateUsuario, deleteUsuario, asignarUsuarioEmpresa} = require('../Controllers/usuarios.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getUsuarios);
router.post('/createUsuario',createUsuario);
router.post('/asignacionEmpresa',asignarUsuarioEmpresa);
router.put('/updateUsuario',updateUsuario); 
router.delete('/deleteUsuario/:id', deleteUsuario);

module.exports = router;