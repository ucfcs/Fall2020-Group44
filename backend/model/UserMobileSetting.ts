import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class UserMobileSetting extends Model {}

UserMobileSetting.init(
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
        modelName: 'UserMobileSetting',
    }
)

export default UserMobileSetting
