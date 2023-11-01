const { connection } = require("../Database/bd");
const bcrypt = require("bcryptjs");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await connection.query(`select u.idUsuario, u.nombre, u.correo, u.celular, r.descripcion as Rol from Usuario u
    inner join Rol r on r.idRol = u.idRol`);
    const roles = await connection.query(`select r.idRol, r.descripcion, r.esActivo, n.nombreNivel from Rol r
    inner join Nivel n on n.idNivel = r.idNivel where r.esActivo = 'ACTIVO'`); 
    res.json({
       usuarios: usuarios[0],
       roles:roles[0]
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "algo salio mal" });
  }
};
const createUsuario = async(req, res) => {
  const { nombre, correo, celular, clave, idRol } = req.body;
  try {
    if (!nombre || !correo || !celular || !clave || !idRol) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      const userFound = await connection.query(`SELECT * FROM Usuario WHERE correo = ?`,[correo]);
      if(userFound[0].length > 0){
         res.json({message:"este usuario ya esta registrado"});
      }else{
          let passHash = await bcrypt.hash(clave, 10);
           connection.query(`INSERT INTO Usuario SET ?`, {
            nombre: nombre,
            correo: correo,
            celular: celular,
            clave: passHash,
            idRol: idRol
          });
          res.json({message:"usuario creado"});
      }
      
    }
  } catch (error) {
    res.json(error);
  }
};

const asignarUsuarioEmpresa = async(req, res) => {
  const {idEmpresa, idUsuario} = req.body;
  try {
    if (!idEmpresa || !idEmpresa) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
        const yaEstaAsignado = await connection.query(`SELECT * FROM Empresas_Usuario WHERE idEmpresa = ? AND idUsuario = ?`,[idEmpresa,idUsuario]); 
        if(yaEstaAsignado[0].length > 0){
            res.json({message:"Este usuario ya esta asignado a esa empresa"}); 
        }else{
           await  connection.query(`INSERT INTO Empresas_Usuario SET ?`, {
            idEmpresa: idEmpresa,
            idUsuario: idUsuario
          });
          res.json({message:"usuario asignado correctamente"});
        }
    }
  } catch (error) {
    res.json(error);
  }
};
const quitarUsuarioEmpresa = async(req, res) => {
  const {id} = req.params;
  try {
    if (!id) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
          await connection.query(`DELETE FROM Empresas_Usuario WHERE id = ?`,[id]);
          res.json({message:"El usuario ha sido desasignado de  la empresa"});
    }
  } catch (error) {
    res.json(error);
  }
};
const getUserEmpresa = async(req,res) =>{
  const {id} = req.params; 
  try {
    const empresasDeUsuario = await connection.query(`select eu.id, usu.nombre, usu.correo, usu.celular, e.nombre as Empresa, e.direccion from Empresas_Usuario eu
    inner join Empresa e on e.idEmpresa = eu.idEmpresa
    inner join Usuario usu on usu.idUsuario = eu.idUsuario
    where eu.idUsuario = ? `, [id]); 
    const empresas = await connection.query(`SELECT * FROM Empresa`); 
    res.json({
       empresasAsignadas: empresasDeUsuario[0],
       empresas: empresas[0]
    }); 
  } catch (error) {
     console.log(error);
     res.json({message:"Algo ocurrio mal"}); 
  }
}

const getUserById = async(req,res) =>{
  const {id} = req.params; 
  try {
    const Usuario = await connection.query(`select * from Usuario where idUsuario = ?`, [id]);
    res.json(Usuario[0]); 
  } catch (error) {
     console.log(error);
     res.json({message:"Algo ocurrio mal"}); 
  }
}
const editpassUser = async(req,res) =>{
  const {idUsuario,nombre,correo,celular, clave} = req.body; 
  try {
    let passHash = await bcrypt.hash(clave, 10);
    await  connection.query(`UPDATE Usuario SET ? WHERE idUsuario = ?`, [{
      clave: passHash
    },idUsuario]);
    res.json({message:"Contraseña actualizada"});
  } catch (error) {
     console.log(error);
     res.json({message:"Algo ocurrio mal"}); 
  }
}
module.exports = {
    getUsuarios,
    createUsuario,
    asignarUsuarioEmpresa,
    getUserEmpresa,
    quitarUsuarioEmpresa,
    getUserById,
    editpassUser
};
