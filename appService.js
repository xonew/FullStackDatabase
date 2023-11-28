const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PLAYER');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PLAYER`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
            console.log(await connection.execute(`select 'drop table ', table_name, 'cascade constraints;' from user_tables`));
            console.log(err);
        }

        const result = await connection.execute(`
            CREATE TABLE PLAYER (
                id INT PRIMARY KEY,
                name VARCHAR(20),
                lv INT,
                guildID  INT
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name, lv, guildID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PLAYER (id, name, lv, guildID) VALUES (:id, :name, :lv, :guildID)`,
            [id, name, lv, guildID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function addGuild(playerID, guildID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PLAYER SET guildID=:guildID where id=:playerID`,
            [guildID, playerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PLAYER SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM PLAYER');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function deletePlayer(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Player WHERE id =:id',
            [id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    deletePlayer,
    addGuild
};