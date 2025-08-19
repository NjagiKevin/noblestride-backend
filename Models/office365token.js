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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expiresIn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    acquiredAt: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    lastRefreshError: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastRefreshAttempt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Office365Token',
    tableName: 'Office365Tokens',
    timestamps: true,
    paranoid: true // Enable soft deletes
  });
  return Office365Token;
};