'use strict';

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultvalue: 2
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          hooks: true
        });
        User.belongsTo(models.Role, {
          foreignKey: 'roleId'
        });
      }
    }
  });
  return User;
};