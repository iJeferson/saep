const express = require('express');
const { criarTurma, deletarTurma, paginaProfessor } = require('../controllers/professorController');

const router = express.Router();


router.get('/professor', paginaProfessor);
router.post('/professor/criar-turma', criarTurma);
router.post('/professor/deletar-turma', deletarTurma);

module.exports = router;
