const { connection } = require("../Database/bd");

const getRoles = async (req, res) => {
  try {
    const roles = await connection.query(`select r.idRol, r.descripcion, r.esActivo, n.nombreNivel from Rol r
    inner join Nivel n on n.idNivel = r.idNivel`);
    const niveles = await connection.query(`select * from Nivel`); 
    res.json({
        roles:roles[0],
        niveles:niveles[0]
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "algo salio mal" });
  }
};
const createRoles = async(req, res) => {
  const { descripcion, idNivel } = req.body;
  try {
    if (!descripcion || !idNivel) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
          await  connection.query(`INSERT INTO Rol SET ?`, {
            descripcion: descripcion,
            esActivo: 'ACTIVO',
            idNivel: idNivel
          });
          res.json({message:"ROL creado"});
    }
  } catch (error) {
    res.json(error);
  }
};
const getOneRol = async(req,res) =>{
    const{idRol} = req.query; 
    try {
     const role =  await connection.query(`select * from Rol where idRol = ?`,[idRol]);
     const niveles = await connection.query(`select * from Nivel`); 
       res.json({
          rol: role[0],
          niveles:niveles[0]
       });
    } catch (error) {
       console.error(error); 
    }
  };

  const updateRole = async(req, res) => {
    const { descripcion, idNivel, idRol } = req.body;
    try {
      if (!descripcion || !idNivel) {
        return res.json({
          message: "Faltan datos",
        });
      } else {
            await  connection.query(`UPDATE Rol SET ? WHERE idRol = ?`, [{
              descripcion: descripcion,
              idNivel: idNivel
            },idRol]);
            res.json({message:"ROL actualizado"});
      }
    } catch (error) {
      res.json(error);
    }
  };
  
  const changeEstadoRole = async(req, res) =>{
    const {id} = req.params; 
    const estadoInactivo = 'INACTIVO';
    const estadoActivo = 'ACTIVO'; 
    try {
      const Estado = await connection.query(
        `SELECT esActivo FROM Rol WHERE idRol = ?`,
        [id]
      );
      let EstadoFinal = Estado[0];
      if (EstadoFinal[0]?.esActivo == "ACTIVO") {
        connection.query(
          `UPDATE Rol SET esActivo = '${estadoInactivo}' WHERE idRol = ?`,
          [id]
        );
        res.json({ message: "Rol inactivado" });
      } else {
        connection.query(
          `UPDATE Rol SET esActivo = '${estadoActivo}' WHERE idRol = ?`,
          [id]
        );
        res.json({ message: "Rol Activado" });
      }
    } catch (error) {
      res.json(error);
    }
}

module.exports = {
    getRoles,
    createRoles,
    getOneRol,
    updateRole,
    changeEstadoRole
};
