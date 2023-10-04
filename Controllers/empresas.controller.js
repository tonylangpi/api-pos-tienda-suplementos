const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getEmpresas = async(req, res) => {
  try {
    const empresas = await connection.query("select * from Empresa");
    res.json(empresas[0]);
  } catch (error) {
     console.log(error);
     res.json({message:"algo salio bad"}); 
  }


};

const DeleteEmpresas = (req, res) => {
  const { id } = req.params;
  try {
       connection.query(`DELETE FROM Empresa WHERE idEmpresa = ?`, [
        id
      ]);
      res.status(204).json({ message: "Empresa eliminada" });
  } catch (error) {
      res.json(error);
  }
}

const updateEmpresa = (req, res) => {
  const {idEmpresa, nombre, direccion} =  req.body; 
  if(!nombre || !direccion || !idEmpresa){
      return  res.json({
          message: "Faltan datos"
      }); 
  }else{
       connection.query('UPDATE Empresa SET ? WHERE idEmpresa = ?', [{ nombre: nombre, direccion: direccion}, idEmpresa]);
       return res.json({message: "Empresa Actualizada"});
  }
}

const createEmpresa = (req, res) => {
  const {nombre, direccion} =  req.body; 
  if(!nombre || !direccion){
      return  res.json({
          message: "Faltan datos"
      }); 
  }else{
       connection.query('INSERT INTO Empresa SET ?',
          {
            nombre:nombre,
            direccion:direccion
          })
       return res.json({message: "Empresa Creada"});
  }
}
module.exports = {
    getEmpresas,
    DeleteEmpresas,
    updateEmpresa,
    createEmpresa
};