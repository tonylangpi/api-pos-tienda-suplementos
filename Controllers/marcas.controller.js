const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getMarcas = (req, res) => {
  connection.query(
    `select M.idMarca, M.marca, U.nombre as CreadoPor from Marca M
    inner join Usuario U on U.idUsuario = M.idUsuario`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createMarcas = (req, res) =>{
  const{marca, idUsuario} = req.body;
  try {
      if(!marca || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Marca SET ?`,{
          marca:marca,
          idUsuario:idUsuario
        });
        res.json({message:"Marca de producto creada"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateMarcas = (req,res) =>{
    const{marca,idMarca} = req.body;
  try {
    connection.query('UPDATE Marca SET ? WHERE idMarca = ?', [{ marca: marca}, idMarca]);
     res.json({message: "Marca de producto Actualizada"});
  } catch (error) {
     res.json(error); 
  }
}

const deleteMarcas = (req, res) =>{
    const {id} = req.params; 
  try {
      connection.query(`DELETE FROM Marca WHERE idMarca = ?`, [
        id
      ]);
      res.status(204).json({"message" : "Marca de producto borrada"}); 
  } catch (error) {
     res.json(error)
  }
}
module.exports = {
  getMarcas,
  createMarcas,
  updateMarcas,
  deleteMarcas
};