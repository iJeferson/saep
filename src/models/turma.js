'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Turma extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definir que uma turma tem várias atividades
      Turma.hasMany(models.Atividade, {
        foreignKey: 'id_turma', // A chave estrangeira que faz a referência da Atividade para a Turma
        as: 'atividades' // Alias que usaremos ao consultar as atividades de uma turma
      });
    }
  }
  Turma.init({
    nome: DataTypes.STRING,
    id_professor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Turma',
  });
  return Turma;
};
