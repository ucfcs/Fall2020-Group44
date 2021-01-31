import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

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

export default UserWebSetting
