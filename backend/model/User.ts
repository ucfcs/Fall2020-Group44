import { DataTypes, Model } from 'sequelize'
const sequelize = require('../config/database')

class User extends Model {}

User.init(
    {
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
)

module.exports = User
