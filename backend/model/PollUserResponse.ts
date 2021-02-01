import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class PollUserResponse extends Model {}

PollUserResponse.init(
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
        pollOptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'PollUserResponse',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'pollId', 'pollOptionId'],
            },
        ],
    }
)

export default PollUserResponse
