import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Poll extends Model {}

Poll.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        folderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Poll',
        indexes: [
            {
                unique: true,
                fields: ['name', 'userId', 'folderId'],
            },
        ],
    }
)

export default Poll
