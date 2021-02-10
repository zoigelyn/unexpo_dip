const express = require('express');
const router = express.Router();

const {vistaInicio} = require('../controllers/inicio.controller');


router.get('/', vistaInicio);

module.exports = router;