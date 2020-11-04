module.exports.vistaInicio = function (req, res, next) {
  
    res.render('index',{
        titulo: 'Inicio'
       });
};