import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

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

export default PollQuestion
