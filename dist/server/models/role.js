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
<<<<<<< HEAD
    // associations can be defined here
=======
>>>>>>> 4f5d186dbe87514d3eeabae2b55811aef05eb4c6
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};