const { connection } = require("../Database/bd");
const bcrypt = require("bcryptjs");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await connection.query(`select u.nombre, u.correo, u.celular, r.descripcion as Rol from usuario u
    inner join rol r on r.idRol = u.idRol`);
    res.json(usuarios[0]);
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
           connection.query(`INSERT INTO Empresas_Usuario SET ?`, {
            idEmpresa: idEmpresa,
            idUsuario: idUsuario
          });
          res.json({message:"usuario asignado correctamente"});
    }
  } catch (error) {
    res.json(error);
  }
};

const updateUsuario = (req, res) => {
  const { descripcion, idCategoria } = req.body;
  try {
    connection.query("UPDATE Categoria SET ? WHERE idCategoria = ?", [
      { descripcion: descripcion },
      idCategoria,
    ]);
    res.json({ message: "Categoria Actualizada" });
  } catch (error) {
    res.json(error);
  }
};

const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const categoriaInProducts = await connection.query(
      `SELECT * FROM Producto WHERE idCategoria = ?`,
      [id]
    );
    if (categoriaInProducts[0].length > 0) {
      res.json({
        message:"no puedes borrar esta categoria, pues ya la tienen uno o varios productos"
      });
    } else {
      connection.query(`DELETE FROM Categoria WHERE idCategoria = ?`, [id]);
      res.json({ message: "categoria borrada" });
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    asignarUsuarioEmpresa
};
