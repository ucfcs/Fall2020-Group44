import { DataTypes, Model } from 'sequelize'
const sequelize = require('../config/database')

class PollUserResponse extends Model {}

PollUserResponse.init(
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        optionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pollId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'PollUserResponse',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'pollId', 'optionId'],
            },
        ],
    }
)

module.exports = PollUserResponse
