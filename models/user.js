const bcrypt = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      name: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      password: {
          type:DataTypes.STRING,
          allowNull: false,
          validate:{
              len:[8]
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

//     User.associate = function(models) {
//       // Associating Author with Posts
//       // When an Author is deleted, also delete any associated Posts
//       User.hasMany(models.UserDialogue, {
//         onDelete: "cascade"
//       });
//     };
//     User.associate = function(models) {
//       // Associating Author with Posts
//       // When an Author is deleted, also delete any associated Posts
//       User.hasMany(models.Event, {
//         onDelete: "cascade"
//       });
//     };
//     return User;
  };

// User.beforeCreate(function(user){
//     user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
// })

// TODO: add image to user column
// TODO: add password to user
// TODO: add unique to username
// encrypt sensitive data, authenticate, store data 