import config from 'config';
import { Sequelize } from 'sequelize';

const dbConfig: object = config.get('DataBase.config');


const sequelize = new Sequelize(dbConfig);

export async function checkDbConnection() {
    try {
        // check if we could connect to database
        await sequelize.authenticate();
        // create all models
        await sequelize.sync({alter: true});
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

export default sequelize;