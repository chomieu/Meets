const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      // user_name, first_name, last_name, password, email?
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8]
        }
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      // can be null if you have no connections
      associate_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          len: [1]
        }
      },
      // total number of plans in lifetime of account
      plans: DataTypes.INTEGER,
      // number of plans made in upcoming week
      upcoming_plans: DataTypes.INTEGER,
    });

    User.associate = function(models) {
      User.hasMany(models.UserDialogue, {
        onDelete: "cascade"
      });
    };

    // utilize bcrypt to encrypt password
    User.beforeCreate(user=>{
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    })

    return User;
  };

// TODO: add image to user column