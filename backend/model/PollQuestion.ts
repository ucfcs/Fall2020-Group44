import { DataTypes, Model } from 'sequelize'
const sequelize = require('../config/database')

class PollQuestion extends Model {}

PollQuestion.init(
    {
        pollId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeToAnswer: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: 'PollQuestion',
    }
)

module.exports = PollQuestion
