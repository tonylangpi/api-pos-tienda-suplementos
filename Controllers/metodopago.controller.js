const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getMetodosPago = async (req, res) => {
  try {
    const metodospago = await connection.query(
      `select * from metodo_pago`
    );
    res.json(metodospago[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "fallo" });
  }
};
const createMetodosPago = (req, res) => {
  const { metodoNombre } = req.body;
  try {
    if (!metodoNombre) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO metodo_pago SET ?`, {
        metodoNombre: metodoNombre,
        Estado:"ACTIVO"
      });
      res.json({ message: "metodo de pago creado" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateMetodosPago = (req, res) => {
  const { metodoNombre, idMetodoPago } = req.body;
  try {
    connection.query("UPDATE metodo_pago SET ? WHERE idMetodoPago = ?", [
      { metodoNombre: metodoNombre },
      idMetodoPago,
    ]);
    res.json({ message: "metodo de pago Actualizada" });
  } catch (error) {
    res.json(error);
  }
};

const changestatusMetodosPago = async (req, res) => {
  const { id } = req.params;
  const estadoInactivo = 'NO ACTIVO';
    const estadoActivo = 'ACTIVO'; 
    try {
      const Estado = await connection.query(
        `SELECT Estado FROM metodo_pago WHERE idMetodoPago = ?`,
        [id]
      );
      let EstadoFinal = Estado[0];
      if (EstadoFinal[0]?.Estado == "ACTIVO") {
        connection.query(
          `UPDATE metodo_pago SET Estado = '${estadoInactivo}' WHERE idMetodoPago = ?`,
          [id]
        );
        res.json({ message: "Metodo de pago inactivado" });
      } else {
        connection.query(
          `UPDATE metodo_pago SET Estado = '${estadoActivo}' WHERE idMetodoPago = ?`,
          [id]
        );
        res.json({ message: "Metodo de pago Activado" });
      }
    } catch (error) {
      res.json(error);
    }
};
module.exports = {
  getMetodosPago,
  createMetodosPago,
  updateMetodosPago,
  changestatusMetodosPago,
};
