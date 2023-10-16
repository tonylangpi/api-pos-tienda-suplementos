const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getFacturasEncabezado = async(req, res) => {
  const {idEmpresa} = req.params
  try {
  const facturasEncabezados = await  connection.query(
      `select ec.idEncabezado, ec.Tipo_Compra, tc.tipo, ec.ProveedorId, P.nombreProve, substring(ec.Fecha_compra,1,10) as Fecha_compra, usu.nombre as Usuario, 
      COALESCE(SUM(prod.precio_costo * dc.Cantidad), 0) AS totalCompra  from Encabezado_Compra ec
           left join Detalle_compra dc on dc.idEncabezado = ec.idEncabezado
           left join Producto prod on prod.codigo = dc.idProducto
           inner join Proveedores P on P.idProveedor = ec.ProveedorId
           inner join Tipo_Compra tc on tc.idTipoCompra = ec.Tipo_Compra
           inner join Usuario usu on usu.idUsuario = ec.idUsuario
           where ec.idEmpresa = ?
           GROUP BY ec.idEncabezado, P.nombreProve, SUBSTRING(ec.Fecha_compra, 1, 10), usu.nombre
           ORDER BY ec.idEncabezado ASC`,[idEmpresa]
    );
    const Proveedores = await connection.query(`select idProveedor, nombreProve, Estado from Proveedores WHERE Estado = 'ACTIVO'`);
    const tipoCompras = await  connection.query(`select idTipoCompra, tipo from Tipo_Compra`);
    res.json({
        encabezados: facturasEncabezados[0],
        proveedores: Proveedores[0],
        tipocompras: tipoCompras[0]
    });
  } catch (error) {
      console.log(error);
      res.json({message:"algo salio mal"});
  }
  
};
const createFacturasEncabezado = (req, res) =>{
  const{Tipo_Compra, Fecha_compra, ProveedorId, idEmpresa, idUsuario} = req.body;
  try {
      if(!Tipo_Compra || !Fecha_compra || !ProveedorId || !idEmpresa || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Encabezado_Compra SET ?`,{
            Tipo_Compra:Tipo_Compra,
            Fecha_compra:Fecha_compra,
            ProveedorId:ProveedorId,
            idEmpresa:idEmpresa,
            idUsuario: idUsuario
        });
        res.json({message:"FACTURA ENCABEZADO DE COMPRA CREADA"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const deleteFacturasEncabezado = async(req, res) =>{
  const{idEncabezado, idEmpresa} = req.query;
  try {
      if(!idEncabezado || !idEmpresa){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
        const [rows] = await connection.query(`SELECT * FROM Detalle_compra WHERE idEncabezado = ?`,[idEncabezado]); 
        if(rows.length > 0){
            res.json({message:"Debes eliminar los detalles para eliminar el encabezado"}); 
        }else{
          connection.query(`DELETE FROM  Encabezado_Compra WHERE idEncabezado = ? AND idEmpresa = ?`,[idEncabezado,idEmpresa]);
          res.json({message:"FACTURA ENCABEZADO DE COMPRA ELIMINADA"}); 
        }
      }
  } catch (error) {
     res.json(error); 
  }
}

module.exports = {
    getFacturasEncabezado,
    createFacturasEncabezado,
    deleteFacturasEncabezado
};