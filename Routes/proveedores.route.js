const express = require('express');
const router = express();

const { getProveedores, createProveedores, updateProveedores, changeStatusProveedor} = require('../Controllers/proveedores.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all',getProveedores);
router.post('/create',createProveedores);
router.put('/updateProveedor',updateProveedores); 
router.delete('/changeStatus/:id', changeStatusProveedor);


module.exports = router;