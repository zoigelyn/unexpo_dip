/*const typeBook = require("../models/typeBook");

module.exports.insertTypeBook = async function insertTypeBook (req, res) {
  const { tipo_tl } = req.body;
  try {
    let newBook = await typeBook.create({
      tipo_tl: tipo_tl,
    });

    if (newBook) {
      return res.json({
        message: " creado safisfactoriamente",
        data: newBook,
      });
    }
  } catch (error) {
      console.log(error),
    res.status(500).json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};
module.exports.searchTypeBooks = async function searchTypeBooks(req, res) {
  try {
    const typeBooks = await typeBook.findAll({
      atributes: [
        "id_tl",
        "tipo_tl",
      ],
    });
    res.json({
      data: typeBooks,
    });
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: "ha ocurrido un error",
    });
  }
};


module.exports.searchOneTypeBook = async function searchOneTypeBook(req, res) {
  var typebook = req.query;

  try {
    const typeBooks = await typeBook.findAll({
      where: typebook,
    });

    res.json({
      data: typeBooks,
      message: "Busqueda exitosa",
    });
  } catch (error) {
    console.log(error);
    res.json({
      data: {},
      message: "Ha ocurrido un error",
    });
  }
};


module.exports.updateTypeBook = async function updateTypeBook(req, res) {
  const typebook = req.query;
  const newTypeBook = req.body;
  console.log(typebook);
  console.log(newTypeBook);
  /*var functionTypeBook = function (newTypeBook, typeBooks) {
    typeBooks.forEach((funcion) => {
      if (newTypeBook.tipo_tl) {
        typeBooks.tipo_tl = newTypeBook.tipo_tl;
      }
    });

    return typeBooks;
  };hasta aqui era el comentario

  try {
    const Books = await typeBook.findAll({
      atributes: [
        "id_tl",
        "tipo_tl",  
      ],
      where: typebook,
    });
    //functionTypeBook(newTypeBook, typeBooks);
    if (Books.length > 0) {
      Books.forEach(async (TypeBook) => {
        await TypeBook.update({
          tipo_tl : newTypeBook.tipo_tl
        });
      });
      return res.json({
        message: "libros actualizados",
        data: Books,
      });
    }
  } catch (e) {
    res.json({
      message: "ha ocurrido un error",
      data: {},
    });
  }
};


module.exports.deleteTypeBook = async function deleteTypeBook(req, res) {
  var typebook = req.query;

  try {
    const deleteCount = await typeBook.destroy({
      where: typebook,
    });
    res.json({
      message: "se han afectado " + deleteCount + " filas",
    });
  } catch (error) {
    res.json({
      message: "ha fallado la eliminacion",
    });
  }
};*/