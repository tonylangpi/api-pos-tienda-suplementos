const { connection } = require("../Database/bd");


const getProveedores = (req, res) => {
  connection.query(
    `SELECT * FROM Proveedores`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};

const getOneProduct = (req,res) =>{
  const{idEmpresa, codProd} = req.body; 
  try {
    connection.query(`select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo, Prod.lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ? and Prod.codigo = ? `,[idEmpresa,codProd],(error, results) =>{
       if(error){
        console.log(error);
       }else{
         res.json(results); 
       }
    });

  } catch (error) {
     console.error(error); 
  }
}

const getSaboresByProduct = (req, res) => {
    const {idEmpresa, codigoProd} = req.body; 
  connection.query(
    `select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo, Prod.lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ?`,[idEmpresa,codigoProd],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createProveedores = (req, res) =>{
  const{ nombreProve,telefono,direccion,idUsuario} = req.body;
  try {
      if(!nombreProve || !telefono || !direccion || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Proveedores SET ?`,{
          nombreProve:nombreProve,
          telefono:telefono,
          direccion:direccion,
          idUsuario:idUsuario
        });
        res.json({message:"proveedor creado"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateProveedores = (req,res) =>{
    const{nombreProve,telefono,direccion,idProveedor} = req.body;
  try {
    connection.query('UPDATE Proveedores SET ? WHERE idProveedor = ?', [{ 
        nombreProve:nombreProve,
        telefono:telefono,
        direccion:direccion}, idProveedor]);
     res.json({message: "Proveedor Actualizado"});
  } catch (error) {
     res.json(error); 
  }
}

const changeStatusProveedor = (req, res) =>{
    const {id} = req.params; 
    const estadoInactivo = 'INACTIVO';
    const estadoActivo = 'ACTIVO'; 
  try {
     connection.query(`SELECT Estado FROM Proveedores WHERE idProveedor = ?`,[id],(error,results) =>{
       if(error){
         console.log(error);
       }else{
          let status = results[0].Estado;
          if(status === "ACTIVO"){
            connection.query(`UPDATE Proveedores SET Estado = '${estadoInactivo}' WHERE idProveedor = ?`, [id],(error,results) =>{
              if(error){
                  console.log(error);
              }else{
                  res.json({message:"Proveedor inactivado"})
              }
          });
          }else{
            connection.query(`UPDATE Proveedores SET Estado = '${estadoActivo}' WHERE idProveedor = ?`, [id],(error,results) =>{
              if(error){
                  console.log(error);
              }else{
                  res.json({message:"Proveedor Activado"})
              }
          });
          }
       }
     })
  } catch (error) {
     res.json(error)
  }
}
module.exports = {
  getProveedores,
  createProveedores,
  updateProveedores,
  changeStatusProveedor,
  getSaboresByProduct
};