const { connection } = require("../Database/bd");
//const bcrypt = require("bcryptjs");

const getSabores = async (req, res) => {
  try {
    const sabores = await connection.query(
      `select S.idSabor, S.sabor, U.nombre as CreadoPor from Sabores S
      inner join Usuario U on U.idUsuario = S.idUsuario`
    );
    res.json(sabores[0]);
  } catch (error) {
    console.log(error);
    res.json({ message: "fallo" });
  }
};
const createSabores = (req, res) => {
  const { sabor, idUsuario } = req.body;
  try {
    if (!sabor || !idUsuario) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO Sabores SET ?`, {
        sabor: sabor,
        idUsuario: idUsuario,
      });
      res.json({ message: "Sabor de producto creada" });
    }
  } catch (error) {
    res.json(error);
  }
};

const updateSabores = (req, res) => {
  const { sabor, idSabor } = req.body;
  try {
    connection.query("UPDATE Sabores SET ? WHERE idSabor = ?", [
      { sabor: sabor },
      idSabor,
    ]);
    res.json({ message: "Sabor de producto Actualizado" });
  } catch (error) {
    res.json(error);
  }
};

const deleteSabores = async (req, res) => {
  const { id } = req.params;
  try {
    const saboresInProducts = await connection.query(
      `SELECT * FROM Producto WHERE idSabor = ?`,
      [id]
    );
    if (saboresInProducts[0].length > 0) {
      res
        .json({
          message:
            "no puedes borrar este sabor pues esta enlazado a algunos productos",
        });
    } else {
      connection.query(`DELETE FROM Sabores WHERE idSabor = ?`, [id]);
      res.json({ message: "Sabor de producto borrado" });
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  getSabores,
  createSabores,
  updateSabores,
  deleteSabores,
};
