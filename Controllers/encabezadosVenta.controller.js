const { connection } = require("../Database/bd");
const PDF = require("pdfkit-construct");

//const bcrypt = require("bcryptjs");

const getFacturasEncabezado = async (req, res) => {
  const { idEmpresa } = req.params;
  try {
    const facturasEncabezados = await connection.query(
      `select ev.idEncabezadoVenta, ev.idtipoVenta, ev.Estado, tv.nombreTipoVenta, ev.idCliente, C.nombre, C.nitCliente, substring(ev.fechaVenta,1,10) as Fecha_venta, usu.nombre as Usuario, 
      COALESCE(SUM(prod.precio_venta * dv.Cantidad), 0) AS totalVenta  from Encabezado_venta ev
           left join detalle_Venta dv on dv.idEncabezadoVenta = ev.idEncabezadoVenta
           left join Producto prod on prod.codigo = dv.idProducto
           inner join Cliente C on C.idCliente = ev.idCliente
           inner join tipoVenta tv on tv.idTipoVenta = ev.idtipoVenta
           inner join metodo_pago mp on mp.idMetodoPago = ev.idMetodoPago
           inner join Usuario usu on usu.idUsuario = ev.idUsuario
           where ev.idEmpresa = ?
           GROUP BY ev.idEncabezadoVenta,C.nombre, substring(ev.fechaVenta,1,10), usu.nombre
           ORDER BY ev.idEncabezadoVenta ASC`,
      [idEmpresa]
    );
    const clientesActivos =
      await connection.query(`select c.idCliente, c.nitCliente, c.nombre, c.telefono, c.direccion, c.Estado from Cliente  c 
    where c.Estado = 'ACTIVO'`);
    const tipoventas = await connection.query(
      `select * from tipoVenta WHERE Estado = 'ACTIVO'`
    );
    const metodopago = await connection.query(
      `select * from metodo_pago where Estado = 'ACTIVO'`
    );
    res.json({
      encabezados: facturasEncabezados[0],
      clientesActivos: clientesActivos[0],
      tipoventa: tipoventas[0],
      metodospago: metodopago[0],
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "algo salio mal" });
  }
};
const createFacturasEncabezadoVenta = (req, res) => {
  const {
    idCliente,
    idMetodoPago,
    idEmpresa,
    idUsuario,
    idtipoVenta,
    nitCliente,
    nombreCliente,
    Estado,
  } = req.body;
  try {
    if (
      !idCliente ||
      !idMetodoPago ||
      !idEmpresa ||
      !idUsuario ||
      !idtipoVenta
    ) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      connection.query(`INSERT INTO Encabezado_venta SET ?`, {
        idCliente: idCliente,
        idMetodoPago: idMetodoPago,
        idEmpresa: idEmpresa,
        idUsuario: idUsuario,
        idtipoVenta: idtipoVenta,
        Estado: Estado,
      });
      res.json({ message: "FACTURA ENCABEZADO DE VENTA CREADA" });
    }
  } catch (error) {
    res.json(error);
  }
};

const deleteFacturasEncabezado = async (req, res) => {
  const { idEncabezadoVenta, idEmpresa, Estado } = req.query;
  try {
    if (!idEncabezadoVenta || !idEmpresa || !Estado) {
      return res.json({
        message: "Faltan datos",
      });
    } else {
      const estadoInactivo = "ANULADA";
      try {
        const detalles = await connection.query(`SELECT * FROM detalle_Venta WHERE idEncabezadoVenta = ?`,[idEncabezadoVenta]);
        if(detalles[0].length > 0){
           res.json({message:"Debes eliminar los detalles antes de anular la factura"}); 
        }else{
          const Estado = await connection.query(
            `SELECT Estado FROM Encabezado_venta WHERE idEncabezadoVenta = ? AND idEmpresa = ?`,
            [idEncabezadoVenta, idEmpresa]
          );
          let EstadoFinal = Estado[0];
          if (EstadoFinal[0]?.Estado == "VIGENTE") {
            connection.query(
              `UPDATE Encabezado_venta SET Estado = '${estadoInactivo}' WHERE idEncabezadoVenta = ? AND idEmpresa = ?`,
              [idEncabezadoVenta, idEmpresa]
            );
            res.json({ message: "FACTURA  ANULADA" });
          }
        }
      } catch (error) {
        res.json(error);
      }
    }
  } catch (error) {
    res.json(error);
  }
};
const generarPdf = async (req, res) => {
  const { idEncabezado, idEmpresa } = req.query;
  try {
    const facturasEncabezados = await connection.query(
      `select ev.idEncabezadoVenta, ev.idtipoVenta, ev.Estado, tv.nombreTipoVenta, mp.metodoNombre, ev.idCliente, C.nombre, C.nitCliente, substring(ev.fechaVenta,1,10) as Fecha_venta, usu.nombre as Usuario, 
      COALESCE(SUM(prod.precio_venta * dv.Cantidad), 0) AS totalVenta  from Encabezado_venta ev
           left join detalle_Venta dv on dv.idEncabezadoVenta = ev.idEncabezadoVenta
           left join Producto prod on prod.codigo = dv.idProducto
           inner join Cliente C on C.idCliente = ev.idCliente
           inner join tipoVenta tv on tv.idTipoVenta = ev.idtipoVenta
           inner join metodo_pago mp on mp.idMetodoPago = ev.idMetodoPago
           inner join Usuario usu on usu.idUsuario = ev.idUsuario
           where ev.idEmpresa = ? and ev.idEncabezadoVenta = ?
           GROUP BY ev.idEncabezadoVenta,C.nombre, substring(ev.fechaVenta,1,10), usu.nombre
           ORDER BY ev.idEncabezadoVenta ASC`,
      [idEmpresa, idEncabezado]
    );
    if (facturasEncabezados[0].length > 0) {
      const encabezadoObjeto = facturasEncabezados[0]
      const encafinalobj = encabezadoObjeto[0]; 
      const doc = new PDF({ bufferPages: true });
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment;filename=FacturaVenta.pdf`,
      });
      doc.on("data", (chunk) => stream.write(chunk));
      doc.on("end", () => stream.end());
      doc.setDocumentHeader(
        {
          height: "25",
        },
        () => {
          doc.fontSize(15).text("FACTURA CASA CESS", {
            width: 420,
            align: "center",
          });
          doc.fontSize(12);
          doc.text(`CLIENTE:  ${encafinalobj?.nombre}`, {
            width: 420,
            align: "left",
          });
          doc.text(`NIT: ${encafinalobj?.nitCliente}`, {
            width: 420,
            align: "left",
          });
          doc.text(`Fecha: ${encafinalobj?.Fecha_venta}`, {
            width: 420,
            align: "left",
          });
          doc.text(`Tipo de venta: ${encafinalobj?.nombreTipoVenta}`, {
            width: 420,
            align: "left",
          });
          doc.text(`Metodo de Pago: ${encafinalobj?.metodoNombre}`, {
            width: 420,
            align: "left",
          });
          doc.text(`TOTAL : Q. ${encafinalobj?.totalVenta}`, {
            width: 420,
            align: "left",
          });
        }
      );
      
      const detallesFactura = await connection.query(
        `SELECT dv.idDetalleVenta, p.codigo, p.descripcion,dv.cantidad, p.precio_venta, (p.precio_venta * dv.cantidad) as Subtotal FROM detalle_Venta dv
        inner join Producto p on p.codigo = dv.idProducto WHERE idEncabezadoVenta = ?`,
        [idEncabezado]
      );
      if(detallesFactura[0].length > 0){
        doc.addTable(
          [
            { key: "idDetalleVenta", label: "idDetalle", align: "left" },
            { key: "codigo", label: "Codigo Producto", align: "left" },
            { key: "descripcion", label: "Descripcion", align: "left" },
            { key: "cantidad", label: "Cantidad" },
            { key: "precio_venta", label: "Precio en Quetzales", align: "right" },
            { key: "Subtotal", label: "Subtotal", align: "right" },
          ],
          detallesFactura[0],
          {
            border: null,
            width: "fill_body",
            striped: true,
            stripedColors: ["#f6f6f6", "#d6c4dd"],
            cellsPadding: 10,
            marginTop: 20,
            marginLeft: 45,
            marginRight: 45,
            headAlign: "left",
          }
        );
        doc.render();
        doc.end();
      }
      
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "algo ocurrio mal" });
  }
};


const ReporteFacturas = async (req, res) => {
  const { fechaInicio, fechaFin, Estado, idEmpresa } = req.body;
  let fechaini = fechaInicio;
  let fechafin = fechaFin;
  let status = Estado;

  fechaactual = new Date();

  if (fechaini == '' || fechaini == null){
      fechaini = '00001-01-01';
  }

  if (fechafin == '' || fechafin == null){
      fechafin = '9999-12-31'
  }

  if (status == '' || status == null){
    status = null;
  }   
  try {
      const consulta  = await connection.query(` SELECT
      ev.idEncabezadoVenta,
      ev.idtipoVenta,
      ev.Estado,
      tv.nombreTipoVenta,
      ev.idCliente,
      C.nombre,
      C.nitCliente,
      SUBSTRING(ev.fechaVenta, 1, 10) AS Fecha_venta,
      usu.nombre AS Usuario,
      COALESCE(SUM(prod.precio_venta * dv.Cantidad), 0) AS totalVenta
    FROM Encabezado_venta ev
    LEFT JOIN detalle_Venta dv ON dv.idEncabezadoVenta = ev.idEncabezadoVenta
    LEFT JOIN Producto prod ON prod.codigo = dv.idProducto
    INNER JOIN Cliente C ON C.idCliente = ev.idCliente
    INNER JOIN tipoVenta tv ON tv.idTipoVenta = ev.idtipoVenta
    INNER JOIN Usuario usu ON usu.idUsuario = ev.idUsuario
    WHERE
      (SUBSTRING(ev.fechaVenta, 1, 10) >= ? AND SUBSTRING(ev.fechaVenta, 1, 10) <= ? OR ev.fechaVenta IS NULL)
      AND (ev.Estado = COALESCE(?, ev.Estado) )
      AND ev.idEmpresa = ?
    GROUP BY ev.idEncabezadoVenta, C.nombre, SUBSTRING(ev.fechaVenta, 1, 10), usu.nombre
    ORDER BY ev.idEncabezadoVenta`,[fechaini,fechafin,status,idEmpresa]);
      res.json(consulta[0]);
   } catch (error) {
       console.log(error); 
       res.json({message:"algo salio mal"})
   }
   
};
module.exports = {
  getFacturasEncabezado,
  createFacturasEncabezadoVenta,
  deleteFacturasEncabezado,
  generarPdf,
  ReporteFacturas,
};
