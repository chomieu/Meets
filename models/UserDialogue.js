module.exports = function(sequelize, DataTypes) {
  // initialize the sequelize UserDialogue table
  var UserDialogue = sequelize.define("UserDialogue", {
    dialogue: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  // associate the user dialogue to one user
  UserDialogue.associate = models => {
    UserDialogue.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return UserDialogue;
};