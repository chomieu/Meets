module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    //   TODO: ask TA about this object
      associate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      plans: DataTypes.INTEGER,
      upcoming_plans: DataTypes.INTEGER,
    });

    User.associate = function(models) {
      User.hasMany(models.UserDialogue, {
        onDelete: "cascade"
      });
    };
    return User;
  };

// TODO: add image to user column