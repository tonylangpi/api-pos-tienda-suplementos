const express = require('express');
const router = express();

const { getRoles,
    createRoles,
    getOneRol,updateRole,changeEstadoRole} = require('../Controllers/roles.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getRoles);
router.post('/createRol',createRoles);
router.get('/oneRol',getOneRol);
router.put('/updateRol',updateRole); 
router.delete('/changeStatusRole/:id', changeEstadoRole);

module.exports = router;