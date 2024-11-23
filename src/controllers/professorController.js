const { Turma, Atividade } = require('../models'); 

const professorController = {
  // Exibir a página do professor com turmas cadastradas
  paginaProfessor(req, res) {
    try {
      const idProfessor = req.session.userId; // ID do professor logado
      const nomeProfessor = req.session.userName; // Nome do professor

      // Buscar turmas associadas ao professor logado
      Turma.findAll({ where: { id_professor: idProfessor } })
        .then(turmas => {
          res.render('professor', {
            title: 'Professor',
            nomeProfessor, // Passando o nome do professor
            turmas // Passando a lista de turmas
          });
        })
        .catch(error => {
          console.error('Erro ao buscar turmas:', error);
          res.status(500).send('Erro ao buscar turmas.');
        });
    } catch (error) {
      console.error('Erro ao acessar a página do professor:', error);
      res.status(500).send('Erro ao acessar a página do professor.');
    }
  },

  // Criar uma nova turma
  async criarTurma(req, res) {
    const { nome } = req.body;
    try {
      const idProfessor = req.session.userId; // ID do professor logado

      if (!nome) {
        return res.status(400).send('O nome da turma é obrigatório.');
      }

      // Criar nova turma associada ao professor
      const novaTurma = await Turma.create({ nome, id_professor: idProfessor });

      res.status(201).json({ message: 'Turma criada com sucesso!', turma: novaTurma });
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      res.status(500).send('Erro ao criar turma.');
    }
  },

  async deletarTurma(req, res) {
    const { id } = req.body; // ID da turma a ser excluída
  
    try {
      if (!id) {
        return res.status(400).send('O ID da turma é obrigatório.');
      }
  
      // Verificar se a turma tem atividades associadas
      const turmaComAtividades = await Turma.findOne({
        where: { id },
        include: {
          model: Atividade, // Incluir o modelo de Atividade
          as: 'atividades', // Alias definido no modelo de Atividade
          required: false // Não precisa retornar nada se não houver atividades
        }
      });
  
      // Se a turma for encontrada, verificar se tem atividades
      if (!turmaComAtividades) {
        return res.status(404).send('Turma não encontrada.');
      }
  
      if (turmaComAtividades.atividades.length > 0) {
        return res.status(400).send('Não é possível deletar a turma. Ela tem atividades associadas.');
      }
  
      // Deletar a turma se não houver atividades associadas
      const turmaDeletada = await Turma.destroy({ where: { id } });
  
      if (!turmaDeletada) {
        return res.status(404).send('Turma não encontrada.');
      }
  
      res.status(200).json({ message: 'Turma deletada com sucesso!' });
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      res.status(500).send('Erro ao deletar turma.');
    }
  }
};

module.exports = professorController;
