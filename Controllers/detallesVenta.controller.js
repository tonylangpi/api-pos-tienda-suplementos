const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getDetallesVentas = async(req, res) => {
    const{idEmpresa, idEncabezadoVenta} = req.query; 
  try {
  const detallesFactura = await  connection.query(
      `SELECT dv.idDetalleVenta, p.codigo, p.descripcion,dv.cantidad, p.precio_venta, (p.precio_venta * dv.cantidad) as Subtotal FROM detalle_Venta dv
      inner join Producto p on p.codigo = dv.idProducto WHERE idEncabezadoVenta = ?`,[idEncabezadoVenta]
    );
    const productos = await connection.query(`select codigo, descripcion, precio_costo, precio_venta, stock, ganancia, Estado from Producto WHERE idEmpresa = ? AND Estado = 'ACTIVO'`,[idEmpresa]);
    res.json({
        detalles: detallesFactura[0],
        productos: productos[0]
    });
  } catch (error) {
      console.log(error);
      res.json({message:"algo salio mal"});
  }
  
};
const createDetalleVentas = async(req, res) =>{
  const{idEncabezadoVenta, idProducto, cantidad, stock, idEmpresa} = req.body;
  try {
      if(!idEncabezadoVenta || !idProducto || !cantidad ){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
        const detalleVentaExistente = await connection.query(`SELECT * FROM detalle_Venta WHERE idEncabezadoVenta = ? AND idProducto = ?`,[idEncabezadoVenta,idProducto]);
        if(detalleVentaExistente[0].length > 0){
           res.json({message:"YA EXISTE ESTE DETALLE CON ESE PRODUCTO SI TE EQUIVOCASTE ELIMINA EL DETALLE Y VUELVE A INGRESARLO"});
        }else{
          const detalleventa = await connection.query(`INSERT INTO detalle_Venta SET ?`,{
            idEncabezadoVenta:idEncabezadoVenta,
            cantidad:cantidad,
            idProducto:idProducto,
            });
           await  connection.query('UPDATE Producto SET ? WHERE codigo = ? AND idEmpresa = ?', [
              {
                stock:stock
              }, 
              idProducto, idEmpresa]);
            res.json({message:"DETALLE VENTA AGREGADO Y STOCK DEL PRODUCTO ACTUALIZADO"}); 
        }
      }
  } catch (error) {
     res.json(error); 
  }
}

const deleteDetalleVentas = async(req, res) =>{
  const{idDetalleVenta, idEmpresa} = req.query;
  try {
      if(!idDetalleVenta || !idEmpresa){
        return  res.json({
          message: "Faltan datos"
      });
      } else {
          const [rows] = await connection.query(`SELECT * FROM detalle_Venta WHERE idDetalleVenta = ?`,[idDetalleVenta])
          const objDetalle = rows[0]
          const existenciaAnterior = await connection.query(`SELECT * FROM Producto where codigo = ? AND idEmpresa = ?`,[objDetalle.idProducto, idEmpresa]); 
          let producto = existenciaAnterior[0];
          let stock = parseInt(producto[0]?.stock);
          let aumentarStock = stock + objDetalle?.cantidad; 
          await connection.query(`UPDATE Producto SET stock = ${aumentarStock} WHERE codigo = ${objDetalle.idProducto}`);
          await connection.query('DELETE FROM detalle_Venta  WHERE idDetalleVenta = ?', [objDetalle.idDetalleVenta]);
          res.json({message:"DETALLE VENTA ELIMINADO Y STOCK DEL PRODUCTO ACTUALIZADO"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}
module.exports = {
    getDetallesVentas,
    createDetalleVentas,
    deleteDetalleVentas
};