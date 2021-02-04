module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        max_people: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        // isPublic: DataTypes.BOOLEAN,
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        
            validate: {
                len: [1]
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Appointment",
            validate: {
                len: [1],
            }
        },
        // isIndoor: DataTypes.BOOLEAN,
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });
    Event.associate = function (models) {
        // We're saying that a Event should belong to an User
        // An Event can't be created without a User due to the foreign key constraint
        Event.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Event;
};