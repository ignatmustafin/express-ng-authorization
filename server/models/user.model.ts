import { User } from '../interfaces/db.interface';
import sequelize from '../data_base/db.connect';
import { DataTypes } from 'sequelize';

const User = sequelize.define(
    "users",
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "first_name"
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "last_name"
        }, 
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING
        }
    }
);

export default User;