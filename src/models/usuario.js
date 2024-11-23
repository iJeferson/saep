'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Usuario.init(
    {
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Usuario',
      hooks: {
        // Hook para encriptar a senha antes de criar o usuário
        async beforeCreate(usuario) {
          const salt = await bcrypt.genSalt(10); 
          usuario.senha = await bcrypt.hash(usuario.senha, salt); 
        },
        async beforeUpdate(usuario) {
          if (usuario.changed('senha')) {
            const salt = await bcrypt.genSalt(10);
            usuario.senha = await bcrypt.hash(usuario.senha, salt);
          }
        },
      },
    }
  );

  return Usuario;
};
