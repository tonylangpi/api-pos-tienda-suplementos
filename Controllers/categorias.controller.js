const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getCategorias = async (req, res) => {
  try {
    const categorias = await connection.query("select * from Categoria");
    res.json(categorias[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "algo salio mal" });
  }
};
const createCategoria = (req, res) => {
  const { descripcion, idUsuario } = req.body;
  try {
    if (!descripcion || !idUsuario) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO Categoria SET ?`, {
        descripcion: descripcion,
        idUsuario: idUsuario,
      });
      res.json({ message: "categoria creada" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateCategoria = (req, res) => {
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

const deleteCategoria = async (req, res) => {
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
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
