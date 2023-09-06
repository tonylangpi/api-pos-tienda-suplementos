const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getPresentaciones = (req, res) => {
  connection.query(
    `select P.idPresentacion, P.presentacion, U.nombre as CreadoPor from Presentacion P
    inner join Usuario U on U.idUsuario = P.idUsuario`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createPresentaciones = (req, res) =>{
  const{presentacion, idUsuario} = req.body;
  try {
      if(!presentacion || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Presentacion SET ?`,{
          presentacion:presentacion,
          idUsuario:idUsuario
        });
        res.json({message:"presentacion de producto creada"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updatePresentaciones = (req,res) =>{
    const{presentacion,idPresentacion} = req.body;
  try {
    connection.query('UPDATE Presentacion SET ? WHERE idPresentacion = ?', [{ presentacion: presentacion}, idPresentacion]);
     res.json({message: "Presentacion de producto Actualizada"});
  } catch (error) {
     res.json(error); 
  }
}

const deletePresentaciones = (req, res) =>{
    const {id} = req.params; 
  try {
      connection.query(`DELETE FROM Presentacion WHERE idPresentacion = ?`, [
        id
      ]);
      res.status(204).json({"message" : "presentacion de producto borrada"}); 
  } catch (error) {
     res.json(error)
  }
}
module.exports = {
  getPresentaciones,
  createPresentaciones,
  updatePresentaciones,
  deletePresentaciones
};