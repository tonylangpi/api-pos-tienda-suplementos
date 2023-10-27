const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getDetallesCompras = async(req, res) => {
    const{idEmpresa, idEncabezado} = req.query; 
  try {
  const detallesFactura = await  connection.query(
      `SELECT dc.idDetalleCompra, dc.Cantidad, p.codigo, p.descripcion, p.precio_costo, (p.precio_costo * dc.Cantidad) as Subtotal FROM Detalle_compra dc
      inner join Producto p on p.codigo = dc.idProducto WHERE idEncabezado = ?`,[idEncabezado]
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
const createDetalleCompra = async(req, res) =>{
  const{idEncabezado, idProducto, Cantidad, precio_costo, ganancia, precio_venta, idEmpresa} = req.body;
  try {
      if(!idEncabezado || !idProducto || !Cantidad || !precio_costo || !precio_venta){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
        const detallecompraExistente = await connection.query(`SELECT * FROM Detalle_compra WHERE idProducto  = ? and idEncabezado = ?`,[idProducto,idEncabezado]); 
        if(detallecompraExistente[0].length > 0){
                res.json({message:"YA AÑADISTE ESTE DETALLE, SI TE EQUIVOCASTE ELIMINALO Y VUELVELO A CREAR"})
        }else{
          const detallecompra = await connection.query(`INSERT INTO Detalle_compra SET ?`,{
            idEncabezado:idEncabezado,
            idProducto:idProducto,
            Cantidad:Cantidad
          });
          const existenciaAnterior = await connection.query(`SELECT * FROM Producto where codigo = ? AND idEmpresa = ?`,[idProducto, idEmpresa]); 
          let producto = existenciaAnterior[0];
          let stock = parseInt(producto[0]?.stock);
          let aumentarStock = stock + parseInt(Cantidad); 
          connection.query('UPDATE Producto SET ? WHERE codigo = ?', [
            { precio_costo: precio_costo,
              precio_venta:precio_venta,
              stock:aumentarStock,
              ganancia:ganancia
            }, 
            idProducto]);
          res.json({message:"DETALLE COMPRA AGREGADO"}); 
        }
      }
  } catch (error) {
     res.json(error); 
  }
}

const deleteDetalleCompra = async(req, res) =>{
  const{idDetalle, idEmpresa} = req.query;
  try {
      if(!idDetalle || !idEmpresa){
        return  res.json({
          message: "Faltan datos"
      });
      } else {
          const [rows] = await connection.query(`SELECT * FROM Detalle_compra WHERE idDetalleCompra = ?`,[idDetalle])
          console.log(rows);
          const objDetalle = rows[0]
          const existenciaAnterior = await connection.query(`SELECT * FROM Producto where codigo = ? AND idEmpresa = ?`,[objDetalle.idProducto, idEmpresa]); 
          let producto = existenciaAnterior[0];
          let stock = parseInt(producto[0]?.stock);
          let ReducirStock = stock - objDetalle?.Cantidad; 
          await connection.query(`UPDATE Producto SET stock = ${ReducirStock} WHERE codigo = ${objDetalle.idProducto}`);
          await connection.query('DELETE FROM Detalle_compra  WHERE idDetalleCompra = ?', [objDetalle.idDetalleCompra]);
          res.json({message:"DETALLE COMPRA ELIMINADO Y STOCK DEL PRODUCTO ACTUALIZADO"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}
module.exports = {
    getDetallesCompras,
    createDetalleCompra,
    deleteDetalleCompra
};