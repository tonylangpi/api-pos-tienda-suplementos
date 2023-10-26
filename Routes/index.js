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
const Clientes = require('./clientes.route'); 
const tipoVenta = require('./tipoventa.route');
const MetodoPago = require('./metodopago.route'); 
const EncabezadosVenta = require('./encabezadosVenta.route'); 
const detallesVenta = require('./detallesVentas.route');
const roles = require('./roles.route'); 
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
/*MODULO DE VENTAS */
router.use('/clientes',Clientes); 
router.use('/tipoventa',tipoVenta);
router.use('/metodopago',MetodoPago);
router.use('/encabezadosVenta',EncabezadosVenta);
router.use('/detallesVenta',detallesVenta)
/*modulo de seguridad */
router.use('/empresas',empresas);
router.use('/usuarios', usuarios);
router.use('/roles',roles)


module.exports = router; 