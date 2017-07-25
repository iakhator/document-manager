
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    access: {
      type: DataTypes.ENUM,
      values: ['public', 'private', 'role']
    }
  });
  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Document;
};
