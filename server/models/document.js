
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'This field cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'This field cannot be empty'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    access: {
      type: DataTypes.ENUM,
      values: ['public', 'private', 'role'],
      validate: {
        notEmpty: {
          msg: 'This field cannot be empty'
        }
      }
    }
  });
  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Document;
};
