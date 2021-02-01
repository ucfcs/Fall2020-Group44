import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class UserWebSetting extends Model {}

UserWebSetting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        document: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'UserWebSetting',
    }
)

export default UserWebSetting
