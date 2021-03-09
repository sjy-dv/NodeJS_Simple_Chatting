module.exports = (sequelize, DataTypes) => {
  const Chat_Log = sequelize.define(
    "chat_log",
    {
      idx: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      chat_room: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chat_msg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: "chat_log table",
    }
  );
  return Chat_Log;
};
