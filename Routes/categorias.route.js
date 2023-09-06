const express = require('express');
const router = express();

const {getCategorias,createCategoria, updateCategoria, deleteCategoria} = require('../Controllers/categorias.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all',getCategorias);
router.post('/createCategoria',createCategoria);
router.put('/updateCategoria',updateCategoria); 
router.delete('/deleteCategoria/:id', deleteCategoria);
// router.post('/create', createUsers);
// router.post('/updateUsers/:id', updateUsers);
// router.put('/updateUsersPassword', updateUsersPassword);
// router.put('/inactivateUsers', inactivateUsers);
// router.post('/getLevels', getLevels);
// router.get('/getCompany', getCompany);
module.exports = router;