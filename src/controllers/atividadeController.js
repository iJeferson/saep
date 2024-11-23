'use strict';
const { Atividade, Turma } = require('../models'); 

// Página de atividades de uma turma
// Página de atividades de uma turma
// Página de atividades de uma turma
exports.paginaAtividade = async (req, res) => {
  try {
    const idTurma = req.query.id_turma;
    
    if (!idTurma) {
      return res.status(400).send('ID da turma não fornecido');
    }

    const turma = await Turma.findByPk(idTurma, {
      include: {
        model: Atividade,
        as: 'atividades',
        attributes: ['id', 'descricao']
      }
    });

    if (!turma) {
      return res.status(404).send('Turma não encontrada');
    }

    // Aqui pegamos o nome do professor da sessão
    const nomeProfessor = req.session.userName; // Nome do professor

    res.render('atividades', {
      turma,
      atividades: turma.atividades,
      nomeProfessor // Passamos o nome do professor para a view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar atividades');
  }
};

// Criar uma nova atividade para uma turma

exports.criarAtividade = async (req, res) => {
  try {
    const { descricao, id_turma } = req.body;
    console.log(`Criando atividade para a turma ID: ${id_turma}`); // Para depuração

    if (!id_turma) {
      return res.status(400).send('ID da turma não fornecido');
    }

    const turma = await Turma.findByPk(id_turma);
    if (!turma) {
      return res.status(404).send('Turma não encontrada');
    }

    const atividade = await Atividade.create({
      descricao,
      id_turma
    });

    res.redirect(`/atividades?id_turma=${id_turma}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar atividade');
  }
};

// Deletar uma atividade
exports.deletarAtividade = async (req, res) => {
  try {
    const { id_atividade, id_turma } = req.body;

    console.log(`Deletando atividade ID: ${id_atividade} da turma ID: ${id_turma}`); // Para depuração

    // Verificando se a atividade existe
    const atividade = await Atividade.findByPk(id_atividade);
    if (!atividade) {
      return res.status(404).send('Atividade não encontrada');
    }

    // Deletando a atividade
    await atividade.destroy();

    // Redirecionando de volta para a página de atividades
    res.redirect(`/atividades?id_turma=${id_turma}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir atividade');
  }
};
