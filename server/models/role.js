
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  Role.associate = (models) => {
    // associations can be defined here
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };
  return Role;
};
