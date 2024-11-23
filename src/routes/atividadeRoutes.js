const express = require('express');
const { paginaAtividade, criarAtividade, deletarAtividade } = require('../controllers/atividadeController');

const router = express.Router();


router.get('/atividades', paginaAtividade);
router.post('/atividades/criar-atividade', criarAtividade);
router.post('/atividades/deletar-atividade', deletarAtividade);

module.exports = router;
