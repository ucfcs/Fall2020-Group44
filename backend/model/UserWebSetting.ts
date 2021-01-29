import { DataTypes, Model } from 'sequelize'
const sequelize = require('../config/database')

class UserWebSetting extends Model {}

UserWebSetting.init(
    {
        document: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'UserWebSetting',
    }
)

module.exports = UserWebSetting
