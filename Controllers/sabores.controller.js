const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getSabores = (req, res) => {
  connection.query(
    `select S.idSabor, S.sabor, U.nombre as CreadoPor from Sabores S
    inner join Usuario U on U.idUsuario = S.idUsuario`,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createSabores = (req, res) =>{
  const{sabor, idUsuario} = req.body;
  try {
      if(!sabor || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
         connection.query(`INSERT INTO Sabores SET ?`,{
          sabor:sabor,
          idUsuario:idUsuario
        });
        res.json({message:"Sabor de producto creada"}); 
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateSabores = (req,res) =>{
    const{sabor,idSabor} = req.body;
  try {
    connection.query('UPDATE Sabores SET ? WHERE idSabor = ?', [{ sabor: sabor}, idSabor]);
     res.json({message: "Sabor de producto Actualizado"});
  } catch (error) {
     res.json(error); 
  }
}

const deleteSabores = (req, res) =>{
    const {id} = req.params; 
  try {
      connection.query(`DELETE FROM Sabores WHERE idSabor = ?`, [
        id
      ]);
      res.status(204).json({"message" : "Sabor de producto borrado"}); 
  } catch (error) {
     res.json(error)
  }
}
module.exports = {
  getSabores,
  createSabores,
  updateSabores,
  deleteSabores
};