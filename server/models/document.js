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
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        Document.belongsTo(models.User, {
          foreignKey: 'userId'
        });
      }
    }
  });
  return Document;
};