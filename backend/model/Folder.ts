import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Folder extends Model {}

Folder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
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

export default Folder
