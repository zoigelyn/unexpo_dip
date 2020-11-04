const express = require('express');
const router = express.Router();
const ejs = require('ejs');


const { isAuthenticated, existeCorreo} = require('../controllers/usuarios.controllers');
const {vistaInicio} = require('../controllers/inicio.controller');


router.get('/pruebacookie', (req, res)=>{
  console.log(req.session.cookie.expires);
  console.log(req.session.view);
});

router.post('/ingresar/existe-c', existeCorreo);



router.get('/loan', (req,res) => {
  
  res.render('loan',{
     titulo: 'Inicio' 
    });
});
router.get('/index', vistaInicio);

module.exports = router;