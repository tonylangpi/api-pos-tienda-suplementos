const express = require('express');
const router = express();

const { getProveedores, createProveedores, updateProveedores, changeStatusProveedor} = require('../Controllers/proveedores.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all',getProveedores);
router.post('/create',createProveedores);
router.put('/updateProveedor',updateProveedores); 
router.delete('/deleteProveedor/:id', changeStatusProveedor);
// router.post('/createProducto',createProductos);
// router.post('/getSabores', getSaboresByProduct);

module.exports = router;