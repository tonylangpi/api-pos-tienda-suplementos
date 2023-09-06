const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getCategorias = (req, res) => {
  connection.query(
    "select * from Categoria",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createCategoria = (req, res) =>{
  const{descripcion, idUsuario} = req.body;
  try {
      if(!descripcion || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Categoria SET ?`,{
          descripcion:descripcion,
          idUsuario:idUsuario
        });
        res.json({message:"categoria creada"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateCategoria = (req,res) =>{
    const{descripcion,idCategoria} = req.body;
  try {
    connection.query('UPDATE Categoria SET ? WHERE idCategoria = ?', [{ descripcion: descripcion}, idCategoria]);
     res.json({message: "Categoria Actualizada"});
  } catch (error) {
     res.json(error); 
  }
}

const deleteCategoria = (req, res) =>{
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
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
};