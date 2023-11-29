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

async function addStatus(playerID, LV) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PLAYER SET lv=:LV where id=:playerID`,
            [LV, playerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function performProjection(tableName, selectedOptions) {
    return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT ${selectedOptions.join(', ')} FROM ${tableName}`
            );
            console.log('projection:' + result);
            return result.rows;
    }).catch(() => {
        return false;
    });
}


async function updateNameDemotable(ID, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PLAYER SET name=:newName where id=:ID`,
            [newName, ID],
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

//Initiate Inventory
async function initiateInventory() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Inventory`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
            console.log(await connection.execute(`select 'drop table ', table_name, 'cascade constraints;' from user_tables`));
            console.log(err);
        }

        const result = await connection.execute(`
            CREATE TABLE Inventory (
                InventoryID INT PRIMARY KEY,
                Name VARCHAR(50),
                Type VARCHAR(50),
                HP_plus INT,
                MP_plus INT,
                ATK_plus INT
            );

            INSERT INTO Inventory VALUES (1, 'Aquila Favonia', 'Equipment', 1000, 0, 0);
            INSERT INTO Inventory VALUES (2, 'Dull Blade', 'Equipment', 0, 0, 0);
            INSERT INTO Inventory VALUES (3, 'Hanatsuki Paddle', 'Equipment', 100, 0, 0);
            INSERT INTO Inventory VALUES (4, 'Rusty Sickle', 'Equipment', 10, 0, 0);
            INSERT INTO Inventory VALUES (5, 'Jotunheim', 'Equipment', 5000, 0, 0);
            INSERT INTO Inventory VALUES (6, 'Jar', 'Item', 0, 0, 0);
            INSERT INTO Inventory VALUES (7, 'Stick', 'Equipment', 0, 0, 0);
            INSERT INTO Inventory VALUES (8, 'Excalibur', 'Equipment', 1500, 0, 50);
            INSERT INTO Inventory VALUES (9, 'Healing Potion', 'Item', 0, 50, 0);
            INSERT INTO Inventory VALUES (10, 'Thunder Staff', 'Equipment', 500, 100, 30);
            INSERT INTO Inventory VALUES (11, 'Invisibility Cloak', 'Item', 0, 0, 0);
            INSERT INTO Inventory VALUES (12, 'Fireball Scroll', 'Item', 0, 20, 0);
            INSERT INTO Inventory VALUES (13, 'Diamond Shield', 'Equipment', 2000, 0, 20);
            INSERT INTO Inventory VALUES (14, 'Health Elixir', 'Item', 100, 0, 0);
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchInventory() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM INVENTORY');
        return result.rows;
    }).catch(() => {
        return [];
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
    addGuild,
    addStatus,
    fetchInventory,
    initiateInventory,
    performProjection
};