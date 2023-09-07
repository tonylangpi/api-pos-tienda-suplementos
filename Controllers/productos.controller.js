const { connection } = require("../Database/bd");


const getProductos = (req, res) => {
  const {idEmpresa} = req.params;
  connection.query(
    `select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo, Prod.lote, C.descripcion as Categoria, M.marca from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca WHERE Prod.idEmpresa = ?`,[idEmpresa],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};

const getPresentacionesByProducts = (req, res) => {
    const {idEmpresa, codigoProd} = req.body; 
  connection.query(
    `select Pres.presentacion from Producto Prod
    inner join Presentacion_Producto PresP on PresP.idProducto = Prod.codigo
    inner join Presentacion Pres on Pres.idPresentacion = PresP.idPresentacion
    WHERE Prod.idEmpresa = ? and Prod.codigo = ?`,[idEmpresa,codigoProd],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};

const getSaboresByProduct = (req, res) => {
    const {idEmpresa, codigoProd} = req.body; 
  connection.query(
    `select Sab.sabor from Producto Prod
    inner join sabores_producto SabProd on SabProd.idProducto = Prod.codigo
    inner join Sabores Sab on Sab.idSabor = SabProd.idSabor
    WHERE Prod.idEmpresa = ? and Prod.codigo = ?`,[idEmpresa,codigoProd],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createProductos = (req, res) =>{
  const{ codigo,descripcion,stock_minimo,lote,idCategoria,idMarca,idEmpresa,idUsuario} = req.body;
  try {
      if(!codigo || !descripcion || !stock_minimo || !lote || !idCategoria || !idMarca 
        || !idUsuario || !idEmpresa || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Producto SET ?`,{
          codigo:codigo,
          descripcion:descripcion,
          stock_minimo:stock_minimo,
          lote:lote,
          idCategoria:idCategoria,
          idMarca:idMarca,
          idEmpresa:idEmpresa,
          idUsuario:idUsuario
        });
        res.json({message:"producto creado"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateProductos = (req,res) =>{
    const{descripcion,idCategoria} = req.body;
  try {
    connection.query('UPDATE Categoria SET ? WHERE idCategoria = ?', [{ descripcion: descripcion}, idCategoria]);
     res.json({message: "Categoria Actualizada"});
  } catch (error) {
     res.json(error); 
  }
}

const deleteProductos = (req, res) =>{
    const {id} = req.params; 
  try {
      connection.query(`DELETE FROM Categoria WHERE idCategoria = ?`, [
        id
      ]);
      res.status(204).json({"message" : "categoria borrada"}); 
  } catch (error) {
     res.json(error)
  }
}
module.exports = {
  getProductos,
  createProductos,
  updateProductos,
  deleteProductos,
  getPresentacionesByProducts,
  getSaboresByProduct
};