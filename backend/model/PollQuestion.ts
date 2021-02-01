import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class PollQuestion extends Model {}

PollQuestion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        pollId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timeToAnswer: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'PollQuestion',
    }
)

export default PollQuestion
