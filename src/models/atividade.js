'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Atividade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definir que uma atividade pertence a uma turma
      Atividade.belongsTo(models.Turma, {
        foreignKey: 'id_turma', // A chave estrangeira usada na tabela Atividade
        as: 'turma' // Alias para usar na consulta
      });
    }
  }

  Atividade.init({
    descricao: DataTypes.STRING,
    id_turma: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Atividade',
  });

  return Atividade;
};
