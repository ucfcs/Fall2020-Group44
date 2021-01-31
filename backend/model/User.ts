import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

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

export default User
