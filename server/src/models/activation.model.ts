import sequelize from '../db.connect';
import {DataTypes} from 'sequelize';

const Activations = sequelize.define(
    "activations",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        activationLink: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            field: "activation_link"
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field:"is_activated"
        }

    },
);

export default Activations;