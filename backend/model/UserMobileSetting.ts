import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

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

export default UserMobileSetting
