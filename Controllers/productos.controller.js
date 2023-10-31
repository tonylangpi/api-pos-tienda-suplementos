const { connection } = require("../Database/bd");
const PDF = require("pdfkit-construct");

const getProductos = async(req, res) => {
  const {idEmpresa} = req.params;
  try {
      const  productos = await  connection.query(
        `select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo,  SUBSTRING(Prod.lote,1,10) as lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion from Producto Prod
        inner join Categoria C on C.idCategoria = Prod.idCategoria
        inner join Marca M on M.idMarca = Prod.idMarca
        inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
        inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
        where Prod.idEmpresa = ?`,[idEmpresa]
      );
      res.json(productos[0]);
  } catch (error) {
     console.log(error);
     res.json({message:"fallo"});
  }
 
};

const getOneProduct = async(req,res) =>{
  const{idEmpresa, codProd} = req.query; 
  try {
   const producto =  await connection.query(`select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo, SUBSTRING(Prod.lote,1,10) AS lote, C.idCategoria, C.descripcion as Categoria, M.idMarca, M.marca, Sab.idSabor, Sab.sabor, Pres.idPresentacion, Pres.presentacion from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ? and Prod.codigo = ? `,[idEmpresa,codProd]);
    const categorias = await connection.query(`SELECT idCategoria, descripcion FROM Categoria`); 
    const marca = await connection.query(`SELECT idMarca, marca  FROM Marca`);
    const presentaciones = await connection.query(`SELECT idPresentacion,presentacion FROM Presentacion`);
    const sabores  = await connection.query(`SELECT idSabor, sabor FROM Sabores`);
     res.json({
       producto: producto[0],
       categorias: categorias[0],
       marcas : marca[0],
       presentaciones:presentaciones[0],
       sabores:sabores[0]
     });
  } catch (error) {
     console.error(error); 
  }
}

const getSaboresByProduct = (req, res) => {
    const {idEmpresa, codigoProd} = req.body; 
  connection.query(
    `select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo, Prod.lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ?`,[idEmpresa,codigoProd],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
};
const createProductos = async(req, res) =>{
  const{ codigo,descripcion,stock,precio_costo,precio_venta,stock_minimo,lote,idCategoria,idMarca,idPresentacion,idSabor,idEmpresa,idUsuario,ganancia} = req.body;
  try {
      if(!codigo || !descripcion || !stock_minimo || !lote || !idCategoria || !idMarca 
        || !idUsuario || !idEmpresa || !idUsuario){
        return  res.json({
          message: "Faltan datos"
      }); 
      } else {
        const findID = await connection.query(`SELECT * FROM Producto WHERE codigo = ? AND idEmpresa = ?`,[codigo, idEmpresa]);
        if(findID[0].length > 0){
          res.json({message:"EL Codigo SKU ya esta registrado en el historial de productos"});
        }else{
          if(stock && precio_costo && precio_venta  && ganancia){
            connection.query(`INSERT INTO Producto SET ?`,{
              codigo:codigo,
              descripcion:descripcion,
              precio_costo:precio_costo,
              precio_venta:precio_venta,
              stock:stock,
              stock_minimo:stock_minimo,
              lote:lote,
              idCategoria:idCategoria,
              idMarca:idMarca,
              idPresentacion:idPresentacion,
              idSabor:idSabor,
              idEmpresa:idEmpresa,
              idUsuario:idUsuario,
              ganancia:ganancia,
              Estado:"ACTIVO"
            });
            res.json({message:"producto creado"}); 
          }else{
            connection.query(`INSERT INTO Producto SET ?`,{
              codigo:codigo,
              descripcion:descripcion,
              precio_costo:0,
              precio_venta:0,
              stock:0,
              stock_minimo:stock_minimo,
              lote:lote,
              idCategoria:idCategoria,
              idMarca:idMarca,
              idPresentacion:idPresentacion,
              idSabor:idSabor,
              idEmpresa:idEmpresa,
              idUsuario:idUsuario,
              ganancia:0,
              Estado:"ACTIVO"
            });
            res.json({message:"producto creado"}); 
          }
          
        }
      }
  } catch (error) {
     res.json(error); 
  }
}

const updateProductos = (req,res) =>{
    const{codigo,descripcion,stock_minimo,lote,idCategoria,idMarca,idPresentacion,idSabor,idEmpresa} = req.body;
  try {
    connection.query('UPDATE Producto SET ? WHERE codigo = ? AND idEmpresa = ?', [{ 
      descripcion: descripcion,
      stock_minimo:stock_minimo,
      lote:lote,
      idCategoria: idCategoria,
      idMarca: idMarca,
      idPresentacion: idPresentacion,
      idSabor: idSabor
    }, codigo, idEmpresa]);
     res.json({message: "PRODUCTO Actualizado"});
  } catch (error) {
     res.json(error); 
  }
}

const deleteProductos = async(req, res) =>{
    const {id} = req.params; 
    const estadoInactivo = 'INACTIVO';
    const estadoActivo = 'ACTIVO'; 
    try {
      const Estado = await connection.query(
        `SELECT Estado FROM Producto WHERE codigo = ?`,
        [id]
      );
      let EstadoFinal = Estado[0];
      if (EstadoFinal[0]?.Estado == "ACTIVO") {
        connection.query(
          `UPDATE Producto SET Estado = '${estadoInactivo}' WHERE codigo = ?`,
          [id]
        );
        res.json({ message: "Producto inactivado" });
      } else {
        connection.query(
          `UPDATE Producto SET Estado = '${estadoActivo}' WHERE codigo = ?`,
          [id]
        );
        res.json({ message: "Producto Activado" });
      }
    } catch (error) {
      res.json(error);
    }
}

const settingsProduct = async(req, res) => {
  const {idEmpresa} = req.params;
  try {
    const productos = await connection.query(`select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo,  SUBSTRING(Prod.lote,1,10) as lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion, Prod.Estado from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ?`,[idEmpresa]);
    const categorias = await connection.query(`SELECT idCategoria, descripcion FROM Categoria`);
    const marcas = await connection.query(`SELECT idMarca, Marca FROM Marca`);
    const  sabores = await connection.query(`SELECT idSabor, sabor FROM Sabores`);
    const presentaciones = await connection.query(`SELECT idPresentacion, presentacion FROM Presentacion`); 
     res.json({
       productos: productos[0],
       categorias: categorias[0],
       marcas: marcas[0],
       sabores: sabores[0],
       presentaciones: presentaciones[0]
     });
  } catch (error) {
    console.log(error);
    res.json({message:"algo salio mal"});
  }
 
};

const ReporteProductos = async(req, res) => {
  const {idEmpresa} = req.params;
let hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1; // Los meses están indexados desde 0
let anio = hoy.getFullYear();

  try {
    const productos = await connection.query(`select Prod.codigo, Prod.descripcion, Prod.precio_venta, Prod.stock, Prod.stock_minimo,  SUBSTRING(Prod.lote,1,10) as lote, C.descripcion as Categoria, M.marca, Sab.sabor, Pres.presentacion, Prod.Estado from Producto Prod
    inner join Categoria C on C.idCategoria = Prod.idCategoria
    inner join Marca M on M.idMarca = Prod.idMarca
    inner join Presentacion Pres on Pres.idPresentacion = Prod.idPresentacion
    inner join Sabores Sab on Sab.idSabor = Prod.idSabor 
    where Prod.idEmpresa = ?`,[idEmpresa]);
    if(productos[0].length > 0){
      const doc = new PDF({
        size: 'A4', // Cambia esto al tamaño de hoja deseado, como 'letter'
        margins: {
           top: 20,
           bottom: 20,
           left: 20,
           right: 20,
        },
        layout: 'landscape', // Cambia esto a 'portrait' si deseas un diseño de retrato
        bufferPages: true,
       });
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment;filename=ReporteProductos.pdf`,
      });
      doc.on("data", (chunk) => stream.write(chunk));
      doc.on("end", () => stream.end());
      doc.setDocumentHeader(
        {
          height: "15",
        },
        () => {
          doc.fontSize(15).text("REPORTE DE PRODUCTOS EN GENERAL", {
            width: 420,
            align: "center",
          });
          doc.fontSize(12);
          doc.text(`FECHA REPORTE:  ${dia} / ${mes} / ${anio}`, {
            width: 420,
            align: "left",
          });
        }
      );
      doc.addTable(
        [
          { key: "codigo", label: "Codigo", align: "left" },
          { key: "descripcion", label: "Descripcion", align: "left" },
          { key: "precio_venta", label: "Precio Q", align: "right" },
          { key: "stock", label: "stock", align: "right" },
          { key: "stock_minimo", label: "stock_minimo", align: "right" },
          { key: "lote", label: "Lote", align: "right" },
          { key: "Categoria", label: "Categoria", align: "right" },
          { key: "marca", label: "Marca", align: "right" },
          { key: "sabor", label: "Sabor", align: "right" },
          { key: "presentacion", label: "Presentacion", align: "right" },
          { key: "Estado", label: "Estado", align: "right" }
        ],
        productos[0],
        {
          border: null,
          width: "fill_body",
          striped: true,
          stripedColors: ["#DFDDBB", "#E9F1D7"],
          cellsPadding: 5,
          marginTop: 20,
          marginLeft: 10,
          marginRight: 45,
          headAlign: "left",
        }
      );
      doc.render();
      doc.end();
    }else{
       res.json({message:"no hay datos"}); 
    }
  } catch (error) {
    console.log(error);
    res.json({message:"algo salio mal"});
  }
 
};
module.exports = {
  getProductos,
  getOneProduct,
  createProductos,
  updateProductos,
  deleteProductos,
  getSaboresByProduct,
  settingsProduct,
  ReporteProductos
};