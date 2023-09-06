const express = require('express');
const router = express();

const {getEmpresas,DeleteEmpresas,updateEmpresa,createEmpresa} = require('../Controllers/empresas.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/all',getEmpresas);
router.delete('/deleteEmpresa/:id',DeleteEmpresas);
router.put('/updateEmpresa',updateEmpresa);
router.post('/createEmpresa',createEmpresa);
// router.post('/userName',getUserName)
// router.post('/create', createUsers);
// router.post('/updateUsers/:id', updateUsers);
// router.put('/updateUsersPassword', updateUsersPassword);
// router.put('/inactivateUsers', inactivateUsers);
// router.post('/getLevels', getLevels);
// router.get('/getCompany', getCompany);
module.exports = router;