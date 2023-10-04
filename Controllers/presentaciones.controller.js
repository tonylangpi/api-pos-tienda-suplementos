const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getPresentaciones = async(req, res) => {
  try {
  const presentaciones = await  connection.query(
      `select P.idPresentacion, P.presentacion, U.nombre as CreadoPor from Presentacion P
      inner join Usuario U on U.idUsuario = P.idUsuario`
    );
    res.json(presentaciones[0]);
  } catch (error) {
      console.log(error);
      res.json({message:"algo salio mal"});
  }
  
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

const deletePresentaciones = async(req, res) =>{
    const {id} = req.params; 
  try {
    const presentacionesInProducts = await connection.query(`SELECT * FROM Producto WHERE idPresentacion = ?`,[id]);
    if(presentacionesInProducts[0].length > 0){
       res.json({message:"no puedes borrar esta presentacion, pues esta enlazada a productos"});
    }else{
      connection.query(`DELETE FROM Presentacion WHERE idPresentacion = ?`, [
        id
      ]);
      res.json({"message" : "presentacion de producto borrada"}); 
    }
      
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