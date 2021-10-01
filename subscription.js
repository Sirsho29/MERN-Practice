const { DataTypes, Sequelize } = require("sequelize");
const db = require("../config/database");
const { User, Goal } = require("./user");
const { Exams, ExamJson, UserAttemptedExam, Results, PickOfTheDay, PickOfTheDayResults } = require("./tests");

var SubscriptionType = db.define("SubscriptionType",
    {
        name: {
            type: DataTypes.STRING,
            max: 100,
            allowNull: false,
            unique: true,
        },
        show: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);


var Subscription = db.define("Subscription",
    {
        name: {
            type: DataTypes.STRING,
            max: 100,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        enrolled: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // validity in months
        validity: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

var UserEnrolledSubscription = db.define("UserEnrolledSubscription",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        expiry: {
            type: DataTypes.DATE,
        },

    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

// Exams.sync({ force: true });
// SubscriptionType.sync({ force: true });
// UserEnrolledSubscription.sync({ force: true });
// Subscription.sync({ force: true });
// ExamJson.sync({ force: true });
// UserAttemptedExam.sync({ force: true });
// PickOfTheDay.sync({ force: true });
// PickOfTheDayResults.sync({ force: true });

SubscriptionType.hasMany(Subscription, { onDelete: 'cascade' });
User.hasMany(UserEnrolledSubscription, { onDelete: 'cascade' });
UserEnrolledSubscription.belongsTo(Subscription, { onDelete: 'cascade' });
Subscription.hasMany(Exams, { onDelete: 'cascade' });
Exams.belongsTo(Subscription, { onDelete: 'cascade' });
Exams.belongsTo(Goal, { onDelete: 'cascade' });
Exams.hasOne(ExamJson, { onDelete: 'cascade' });
User.hasMany(UserAttemptedExam, { onDelete: 'cascade' });
UserAttemptedExam.belongsTo(Exams, { onDelete: 'cascade' });
User.hasMany(Results, { onDelete: 'cascade' });
Results.belongsTo(Exams, { onDelete: 'cascade' });
User.hasMany(PickOfTheDayResults, { onDelete: 'cascade' });
PickOfTheDayResults.belongsTo(PickOfTheDay, { onDelete: 'cascade' });
PickOfTheDay.belongsTo(Goal, { onDelete: 'cascade' });

// Exams.belongsTo(User, { foreignKey: 'created_by' });

Exams.sync({ alter: true });
SubscriptionType.sync({ alter: true });
UserEnrolledSubscription.sync({ alter: true });
Subscription.sync({ alter: true });
ExamJson.sync({ alter: true });
UserAttemptedExam.sync({ alter: true });
Results.sync({ alter: true });
PickOfTheDay.sync({ alter: true });
PickOfTheDayResults.sync({ alter: true });


module.exports = { Subscription, SubscriptionType, UserEnrolledSubscription };
