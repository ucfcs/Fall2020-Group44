const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/database')

class Folder extends Model {}

Folder.init(
    {
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
    },
    {
        sequelize,
        modelName: 'Folder',
        indexes: [
            {
                unique: true,
                fields: ['name', 'userId', 'courseId'],
            },
        ],
    }
)

module.exports = Folder
