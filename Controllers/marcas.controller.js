const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getMarcas = async (req, res) => {
  try {
    const marcas = await connection.query(
      `select M.idMarca, M.marca, U.nombre as CreadoPor from Marca M
    inner join Usuario U on U.idUsuario = M.idUsuario`
    );
    res.json(marcas[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "fallo" });
  }
};
const createMarcas = (req, res) => {
  const { marca, idUsuario } = req.body;
  try {
    if (!marca || !idUsuario) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO Marca SET ?`, {
        marca: marca,
        idUsuario: idUsuario,
      });
      res.json({ message: "Marca de producto creada" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateMarcas = (req, res) => {
  const { marca, idMarca } = req.body;
  try {
    connection.query("UPDATE Marca SET ? WHERE idMarca = ?", [
      { marca: marca },
      idMarca,
    ]);
    res.json({ message: "Marca de producto Actualizada" });
  } catch (error) {
    res.json(error);
  }
};

const deleteMarcas = async (req, res) => {
  const { id } = req.params;
  try {
    const marcasInProducts = await connection.query(
      `SELECT * FROM Producto WHERE idMarca = ?`,
      [id]
    );
    if (marcasInProducts[0].length > 0) {
      res.json({
        message:"no puedes borrar esta marca, pues esta enlazada a uno o  varios productos",
      });
    } else {
      connection.query(`DELETE FROM Marca WHERE idMarca = ?`, [id]);
      res.json({ message: "Marca de producto borrada" });
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  getMarcas,
  createMarcas,
  updateMarcas,
  deleteMarcas,
};
