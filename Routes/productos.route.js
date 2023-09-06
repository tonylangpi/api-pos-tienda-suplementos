const express = require('express');
const router = express();

const { getProductos,
    createProductos,
    updateProductos,
    deleteProductos,
    getPresentacionesByProducts,
    getSaboresByProduct} = require('../Controllers/productos.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all/:idEmpresa',getProductos);
router.post('/createProducto',createProductos);
router.put('/updateProducto',updateProductos); 
router.delete('/deleteProducto/:id', deleteProductos);
router.get('/getPresentaciones',getPresentacionesByProducts);
router.post('/getSabores', getSaboresByProduct);

module.exports = router;