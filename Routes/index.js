const express = require('express');
const router = express();
const categorias = require('./categorias.route');
const empresas = require('./empresas.route');
const presentaciones = require('./presentaciones.route');
const marcas = require('./marcas.route');
const sabores = require('./sabores.route');
const productos = require('./productos.route');
const proveedores = require('./proveedores.route'); 
const usuarios = require('./usuarios.route');
const tipoCompra = require('./tipocompra.route'); 
const EncabezadosCompra = require('./encabezadosCompra.route'); 
const DetallesCompras = require('./detallesCompra.route'); 
// const roles = require('./roles.route');
// const auth = require('./auth.route');
// const beneficiarios = require('./beneficiarios.route');
// const sesiones = require('./sesiones.route');
// const reportes = require('./reportes.route');
// const servicios = require('./servicios.route');
/*rutas para el modulo de productos */
router.use('/presentaciones',presentaciones); 
router.use('/categorias',categorias);
router.use('/marcas',marcas);
router.use('/sabores',sabores); 
router.use('/productos',productos);
/* modulo de compras */
router.use('/proveedores', proveedores); 
router.use('/tipocompra', tipoCompra); 
router.use('/encabezadosCompra',EncabezadosCompra);
router.use('/detallesCompras', DetallesCompras);
/*modulo de seguridad */
router.use('/empresas',empresas);
router.use('/usuarios', usuarios)
// router.use('/auth', auth);
// router.use('/beneficiarios', beneficiarios);
// router.use('/sesiones', sesiones);
// router.use('/reportes',reportes);
// router.use('/servicios',servicios)

module.exports = router; 