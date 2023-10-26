const express = require('express');
const router = express();

const { getUsuarios, createUsuario, getUserEmpresa, asignarUsuarioEmpresa, quitarUsuarioEmpresa, getUserById, editpassUser} = require('../Controllers/usuarios.controller');

//rutas de CRUD sobre tabla marcas
router.get('/all',getUsuarios);
router.post('/createUsuario',createUsuario);
router.get('/getUserEmpresas/:id', getUserEmpresa)
router.post('/asignacionEmpresa',asignarUsuarioEmpresa);
router.delete('/quitarUsuarioEmpresa/:id',quitarUsuarioEmpresa);
router.get('/oneuser/:id',getUserById); 
router.put('/editPass',editpassUser); 
// router.put('/updateUsuario',updateUsuario); 
// router.delete('/deleteUsuario/:id', deleteUsuario);

module.exports = router;