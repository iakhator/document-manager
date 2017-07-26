'use strict';

module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  Role.associate = function (models) {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};