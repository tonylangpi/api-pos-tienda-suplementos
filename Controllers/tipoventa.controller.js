const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getTipoVenta = async (req, res) => {
  try {
    const tipoVenta = await connection.query(
      `select * from tipoVenta`
    );
    res.json(tipoVenta[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "fallo" });
  }
};
const createTipoVenta = (req, res) => {
  const { nombreTipoVenta } = req.body;
  try {
    if (!nombreTipoVenta) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO tipoVenta SET ?`, {
        nombreTipoVenta: nombreTipoVenta,
        Estado:"ACTIVO"
      });
      res.json({ message: "tipo  de venta creado" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateTipoVenta = (req, res) => {
  const { nombreTipoVenta, idTipoVenta } = req.body;
  try {
    connection.query("UPDATE tipoVenta SET ? WHERE idTipoVenta = ?", [
      { nombreTipoVenta: nombreTipoVenta },
      idTipoVenta,
    ]);
    res.json({ message: "tipo venta Actualizada" });
  } catch (error) {
    res.json(error);
  }
};

const deleteTipoVenta = async (req, res) => {
  const { id } = req.params;
  const estadoInactivo = 'NO ACTIVO';
    const estadoActivo = 'ACTIVO'; 
    try {
      const Estado = await connection.query(
        `SELECT Estado FROM tipoVenta WHERE idTipoVenta = ?`,
        [id]
      );
      let EstadoFinal = Estado[0];
      if (EstadoFinal[0]?.Estado == "ACTIVO") {
        connection.query(
          `UPDATE tipoVenta SET Estado = '${estadoInactivo}' WHERE idTipoVenta = ?`,
          [id]
        );
        res.json({ message: "Tipo venta inactivado" });
      } else {
        connection.query(
          `UPDATE tipoVenta SET Estado = '${estadoActivo}' WHERE idTipoVenta = ?`,
          [id]
        );
        res.json({ message: "Tipo venta Activado" });
      }
    } catch (error) {
      res.json(error);
    }
};
module.exports = {
  getTipoVenta,
  createTipoVenta,
  updateTipoVenta,
  deleteTipoVenta,
};
