'use strict';

module.exports = function (sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
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
  Document.associate = function (models) {
<<<<<<< HEAD
    // associations can be defined here
=======
>>>>>>> 4f5d186dbe87514d3eeabae2b55811aef05eb4c6
    Document.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Document;
};