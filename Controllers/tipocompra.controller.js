const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getTipoCompras = async (req, res) => {
  try {
    const tipoCompras = await connection.query(
      `select * from Tipo_Compra`
    );
    res.json(tipoCompras[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "fallo" });
  }
};
const createTipoCompra = (req, res) => {
  const { tipo, idUsuario } = req.body;
  try {
    if (!tipo || !idUsuario) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO Tipo_Compra SET ?`, {
        tipo: tipo,
        idUsuario: idUsuario,
      });
      res.json({ message: "Tipo Compra creada" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateTipoCompra = (req, res) => {
  const { tipo, idTipoCompra } = req.body;
  try {
    connection.query("UPDATE Tipo_Compra SET ? WHERE idTipoCompra = ?", [
      { tipo: tipo },
      idTipoCompra,
    ]);
    res.json({ message: "Tipo de Compra Actualizado" });
  } catch (error) {
    res.json(error);
  }
};

const deleteTipoCompra = async (req, res) => {
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
    getTipoCompras,
    createTipoCompra,
  updateTipoCompra,
  deleteTipoCompra,
};
