'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Office365Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Office365Token.init({
    userId: DataTypes.UUID,
    accessToken: DataTypes.TEXT,
    refreshToken: DataTypes.TEXT,
    expiresIn: DataTypes.INTEGER,
    acquiredAt: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Office365Token',
  });
  return Office365Token;
};