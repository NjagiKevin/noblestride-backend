module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define(
    "api_key",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { timestamps: true }
  );

  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return ApiKey;
};