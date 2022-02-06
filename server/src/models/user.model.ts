import sequelize from '../db.connect';
import {DataTypes} from 'sequelize';

const User = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
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