const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const UsuarioController = require('../controllers/UsuarioController');

// Esto es el CRUD RESTful

// Con esto leemos a todos los usuarios
router.get('/', auth,  UsuarioController.traeUsuarios);
// http://localhost:3000/usuarios

// Con esto registramos a un usuario
router.post('/', UsuarioController.registraUsuario);
// http://localhost:3000/usuarios

// Con esto borramos a todos los usuarios
router.delete('/', isAdmin, UsuarioController.deleteAll);
// http://localhost:3000/usuarios

// Con esto efectuamos el login
router.post('/login', UsuarioController.logUsuario);
// https://localhost:3000/usuarios/login

module.exports = router;