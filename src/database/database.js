/* eslint-disable import/no-mutable-exports */
import Sequelize from 'sequelize';
import initModels from '../models/modelInit';
import initAssociations from '../models/modelAssociation';
import log from '../helpers/logging';

let sequelize;

const baseDbSettings = {
    logging: message => {
        if (process.env.DEBUG === true) {
            log(message);
        }
    }
};

const getProductionConnection = () =>
    new Sequelize(
        process.env.DB_DATABASE,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            ...baseDbSettings
        }
    );

const getTestConnection = () =>
    new Sequelize(process.env.DB_DATABASE, null, null, {
        dialect: 'sqlite',
        storage: process.env.DB_FILE,
        ...baseDbSettings
    });

const database = async () => {
    log(`=> using ${sequelize ? 'existing' : 'new'} database connection`);

    if (!sequelize) {
        sequelize = process.env.DB_FILE
            ? getTestConnection()
            : getProductionConnection();

        log('=> connection has started');

        await initModels(sequelize);
        log('=> models initialized');

        await initAssociations();
        log('=> associations initialized');

        await sequelize.sync();
        log('=> database models synced');
    }

    return sequelize;

    /* eslint-enable no-console */
};

export default database;
