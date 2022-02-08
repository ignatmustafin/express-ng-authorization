import config from 'config';
import {Sequelize} from 'sequelize';

const sequelize = new Sequelize(config.get('DataBase.config'));

export async function checkDbConnection() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

export default sequelize;