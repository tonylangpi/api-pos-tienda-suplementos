const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getDetallesCompras = async(req, res) => {
    const{idEmpresa, idEncabezado} = req.query; 
  try {
  const detallesFactura = await  connection.query(
      `SELECT dc.idDetalleCompra, dc.Cantidad, p.descripcion, p.precio_costo FROM Detalle_compra dc
      inner join Producto p on p.codigo = dc.idProducto WHERE idEncabezado = ?`,[idEncabezado]
    );
    const productos = await connection.query(`select codigo, descripcion from Producto WHERE idEmpresa = ?`,[idEmpresa]);
    res.json({
        detalles: detallesFactura[0],
        productos: productos[0]
    });
  } catch (error) {
      console.log(error);
      res.json({message:"algo salio mal"});
  }
  
};
const createDetalleCompra = (req, res) =>{
  const{idEncabezado, idProducto, Cantidad, precio_costo, ganancia, precio_venta, precio_mayoreo} = req.body;
  try {
      if(!idEncabezado || !idProducto || !Cantidad || !precio_costo || !precio_venta || !precio_mayoreo){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Detalle_compra SET ?`,{
          idEncabezado:idEncabezado,
          idProducto:idProducto,
          Cantidad:Cantidad
        });
        connection.query('UPDATE Producto SET ? WHERE codigo = ?', [
          { precio_costo: precio_costo,
            precio_venta:precio_venta,
            precio_mayoreo:precio_mayoreo,
            stock:Cantidad
          }, 
          idProducto]);
        res.json({message:"DETALLE COMPRA AGREGADO"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

module.exports = {
    getDetallesCompras,
    createDetalleCompra
};