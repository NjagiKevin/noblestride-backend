module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define(
    "user_session",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      device: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      login_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      logout_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  UserSession.associate = (models) => {
    UserSession.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return UserSession;
};