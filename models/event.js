module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          },
          max_people: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          },
    });
    Event.associate = function(models) {
        // We're saying that a Event should belong to an Author
        // A Event can't be created without an Author due to the foreign key constraint
        Event.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return Event;
  };