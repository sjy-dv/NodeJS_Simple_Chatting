module.exports = (sequelize, DataTypes) => {
  const Chat_Room = sequelize.define(
    "chat_room",
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
      chat_group_member: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chat_group_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: "chat_room table",
    }
  );
  return Chat_Room;
};
