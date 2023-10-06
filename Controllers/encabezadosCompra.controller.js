const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getFacturasEncabezado = async(req, res) => {
  try {
  const facturasEncabezados = await  connection.query(
      `select ec.idEncabezado, ec.Tipo_Compra, tc.tipo, ec.ProveedorId, P.nombreProve, substring(ec.Fecha_compra,1,10) as Fecha_compra  from Encabezado_Compra ec
      inner join Proveedores P on P.idProveedor = ec.ProveedorId
      inner join Tipo_Compra tc on tc.idTipoCompra = ec.Tipo_Compra`
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
  const{Tipo_Compra, Fecha_compra, ProveedorId} = req.body;
  try {
      if(!Tipo_Compra || !Fecha_compra || !ProveedorId){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Encabezado_Compra SET ?`,{
            Tipo_Compra:Tipo_Compra,
            Fecha_compra:Fecha_compra,
            ProveedorId:ProveedorId
        });
        res.json({message:"FACTURA ENCABEZADO DE COMPRA CREADA"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

module.exports = {
    getFacturasEncabezado,
    createFacturasEncabezado
};