const express = require('express');
const { engine } = require('express-handlebars');
const { createDatabaseIfNotExists } = require('./src/utils/database.js');
const { Turma, Atividade, Usuario } = require('./src/models');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Handlebars
app.engine('handlebars', engine({
    handlebars: require('handlebars'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Desabilita a restrição de acesso às propriedades do protótipo
    },
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Função para criar o banco de dados se não existir
createDatabaseIfNotExists();

// Rota para exibir as turmas
app.get('/professor', async (req, res) => {
    try {
        // Simplesmente listar todas as turmas
        const turmas = await Turma.findAll({
            attributes: ['id', 'nome'], // Somente os campos necessários
        });

        // Renderiza a view 'professor' com as turmas
        res.render('professor', { turmas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar turmas');
    }
});

app.post('/logout', (req, res) => {
    res.render('home');
});

// Rota para cadastrar uma nova turma
app.post('/professor', async (req, res) => {
    try {
        const { nome } = req.body;
        
        // Criar nova turma
        await Turma.create({ nome });

        // Buscar turmas novamente após a criação
        const turmas = await Turma.findAll({
            attributes: ['id', 'nome'],
        });

        // Renderiza novamente a página de turmas com as turmas atualizadas
        res.render('professor', { turmas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar a turma');
    }
});

// Alteração para DELETE ao invés de POST
app.delete('/excluir-turma/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Verifica se a turma existe
        const turma = await Turma.findByPk(id);
        if (!turma) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        // Exclui a turma
        await Turma.destroy({ where: { id } });

        // Envia a resposta de sucesso
        res.json({ success: true });
    } catch (error) {
        console.error('Erro na exclusão:', error);
        res.status(500).json({ error: 'Erro ao excluir a turma' });
    }
});

// Rota para exibir a página de atividades
app.get('/turmas/:id/atividades', async (req, res) => {
    const turmaId = req.params.id;  // Certifique-se de pegar o id correto da URL
    try {
        // Buscar a turma com as atividades associadas
        const turma = await Turma.findByPk(turmaId, {
            include: [
                {
                    model: Atividade,  // Incluir as atividades associadas
                    as: 'atividades'   // Usar o alias definido na associação
                }
            ]
        });

        if (!turma) {
            return res.status(404).send('Turma não encontrada');
        }

        // Passar as atividades para o Handlebars
        res.render('atividades', {
            turma: turma,
            atividades: turma.atividades || []  // Garantir que atividades seja um array
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar as atividades');
    }
});

// Rota para cadastrar uma nova atividade
app.post('/cadastrar-atividade', async (req, res) => {
    const { descricao, turmaId } = req.body;

    try {
        // Criar nova atividade
        await Atividade.create({
            descricao,
            id_turma: turmaId
        });

        // Redirecionar para a página de atividades
        res.redirect(`/turmas/${turmaId}/atividades`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar a atividade');
    }
});

app.listen(3001, () => {
    console.log('Server running on port http://localhost:3001');
});
