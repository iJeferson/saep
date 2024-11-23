const express = require('express');
const { paginaLogin, logar, logout } = require('../controllers/loginController');

const router = express.Router();

// Rotas de login e logout
router.get('/', paginaLogin);
router.post('/login', logar);
router.post('/logout', logout);

module.exports = router;
