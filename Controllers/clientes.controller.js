const { connection } = require("../Database/bd");


const getClientes = async(req, res) => {
  try {
     const clientes = await  connection.query(
      `select c.idCliente, c.nitCliente, c.nombre, c.telefono, c.direccion, c.Estado from Cliente  c`
    );
    res.json({
        clientes: clientes[0]
    });
  } catch (error) {
     console.log(error);
     res.json({message:"fallo"});
  }
 
};

const createClientes = async(req, res) =>{
  const{ nitCliente,nombre,telefono,direccion, } = req.body;
  try {
      if(!nitCliente || !nombre || !direccion || !telefono){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
        const clienteconNitIgual = await connection.query(`SELECT * FROM Cliente WHERE nitCliente = ?`,[nitCliente]); 
        if(clienteconNitIgual[0].length > 0){
             res.json({message:"EL NIT YA ESTA REGISTRADO EN UN CLIENTE ESTE DEBE SER UNICO"}); 
        }else{
         await connection.query(`INSERT INTO Cliente SET ?`,{
            nitCliente:nitCliente,
            nombre:nombre,
            telefono:telefono,
            direccion:direccion,
            Estado:'ACTIVO'
        });
        res.json({message:"cliente creado"}); 
        }
      }
  } catch (error) {
     res.json(error); 
  }
}
const getOneCliente = async(req,res) =>{
    const{codCliente} = req.query; 
    try {
     const cliente =  await connection.query(`select c.idCliente, c.nitCliente, c.nombre, c.telefono, c.direccion from Cliente  c 
      where c.idCliente = ? `,[codCliente]);
       res.json({
         clientes: cliente[0]
       });
    } catch (error) {
       console.error(error); 
    }
  }
  
const updateClientes = (req,res) =>{
    const{nitCliente,nombre,telefono,direccion, idCliente} = req.body;
  try {
    if(!idCliente){
      return  res.json({
        message: "Faltan datos"
    }); 
    } else {
      connection.query('UPDATE Cliente SET ? WHERE idCliente = ?', [{ 
        nitCliente:nitCliente,
        nombre:nombre,
        telefono:telefono,
        direccion:direccion}, idCliente]);
     res.json({message: "Cliente Actualizado"});
    }
  
  } catch (error) {
     res.json(error); 
  }
}

const changeStatusClientes = async(req, res) =>{
    const {id} = req.params; 
    const estadoInactivo = 'NO ACTIVO';
    const estadoActivo = 'ACTIVO'; 
    try {
      const Estado = await connection.query(
        `SELECT Estado FROM Cliente WHERE idCliente = ?`,
        [id]
      );
      let EstadoFinal = Estado[0];
      if (EstadoFinal[0]?.Estado == "ACTIVO") {
        connection.query(
          `UPDATE Cliente SET Estado = '${estadoInactivo}' WHERE idCliente = ?`,
          [id]
        );
        res.json({ message: "Cliente inactivado" });
      } else {
        connection.query(
          `UPDATE Cliente SET Estado = '${estadoActivo}' WHERE idCliente = ?`,
          [id]
        );
        res.json({ message: "Cliente Activado" });
      }
    } catch (error) {
      res.json(error);
    }
}
module.exports = {
  getClientes,
  createClientes,
  updateClientes,
  changeStatusClientes,
  getOneCliente
};