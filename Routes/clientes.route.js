const express = require('express');
const router = express();

const { getClientes, createClientes, updateClientes, changeStatusClientes, getOneCliente} = require('../Controllers/clientes.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all',getClientes);
router.post('/create',createClientes);
router.get('/getoneCliente', getOneCliente); 
router.put('/updateCliente',updateClientes); 
router.delete('/changeStatus/:id', changeStatusClientes);


module.exports = router;