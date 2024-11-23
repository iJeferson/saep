const bcrypt = require('bcrypt');
const { Usuario } = require('../models'); 

const loginController = {
  // Renderiza a tela de login
  paginaLogin(req, res) {
    res.render('login', { title: 'Login' }); 
  },

  // Processa o login
  async logar(req, res) {
    const { email, senha } = req.body;

    try {
      // Busca o usuário pelo e-mail
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).render('login', {
          title: 'Login',
          error: 'E-mail ou senha inválidos.',
        });
      }

      // Verifica se a senha está correta
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).render('login', {
          title: 'Login',
          error: 'E-mail ou senha inválidos.',
        });
      }

      // Armazena informações do usuário na sessão
      req.session.userId = usuario.id;
      req.session.userName = usuario.nome;

      // Redireciona para a página principal do professor
      res.redirect('/professor');
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).render('login', {
        title: 'Login',
        error: 'Erro ao processar o login. Tente novamente mais tarde.',
      });
    }
  },

  // Efetua o logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao encerrar a sessão:', err);
        return res.status(500).send('Erro ao sair do sistema.');
      }
      res.redirect('/'); 
    });
  },
};

module.exports = loginController;
