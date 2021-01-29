import { DataTypes, Model } from 'sequelize'
const sequelize = require('../config/database')

class UserMobileSetting extends Model {}

UserMobileSetting.init(
    {
        document: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'UserMobileSetting',
    }
)

module.exports = UserMobileSetting
