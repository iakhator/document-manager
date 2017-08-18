module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'userName already exist'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'email already exist'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Input a valid email address'
        }
      }
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
  });
  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      hooks: true
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
