const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const { createDatabaseIfNotExists } = require('./src/utils/database.js');
const loginRoutes = require('./src/routes/loginRoutes');
const professorRoutes = require('./src/routes/professorRoutes');
const atividadeRoutes = require('./src/routes/atividadeRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'teste@1234',
    resave: false,
    saveUninitialized: false,
}));

// Configuração do Handlebars
app.engine('handlebars', engine({
    handlebars: require('handlebars'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
}));

app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Função para criar o banco de dados se não existir
createDatabaseIfNotExists();

// Rotas
app.use('/', loginRoutes);
app.use('/', professorRoutes);
app.use('/', atividadeRoutes);

// Inicialização do servidor
app.listen(3001, () => {
    console.log('Server running on port http://localhost:3001');
});
