import sequelize from '../db.connect';
import {DataTypes} from 'sequelize';
import Activations from './activation.model';

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
            allowNull: true,
            validate: {
                customValidator(value: any) {
                  if (value === null && this.googleRegistration === false) {
                    throw new Error("enter the password");
                  }
                }
            }
            
        },
        avatar: {
            type: DataTypes.STRING
        },
        googleRegistration: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "google_registration"
        }
    }
);
User.hasOne(Activations, {
    as: "isActivated",
    foreignKey: {
        name: 'user_id',
        allowNull: false,
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
});
export default User;