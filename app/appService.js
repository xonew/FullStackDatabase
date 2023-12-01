const { query } = require('express');
const mySQL = require('mysql2/promise');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    host: 'db',
    user: 'username',
    password: 'password',
    database: 'db',
};
const connectionPool = mySQL.createPool(dbConfig);
async function withDB(action) {
    try {
        connection = await connectionPool.getConnection();
        return action(connection);

    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (connection) {
            await connection.release();
        }
    }
}



// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function getAllTableNames() {
    return await withDB(async (connection) => {
        return await connection.query(`SHOW TABLES`);
    }).catch(() => {
        return false;
    });
}

//Gets all the attributes of all tables given, returns an object with the table name as the key and the attributes as the value
async function getAllTableAttributes(tableNames) {
    let tableAttributes = {};

    await withDB(async (connection) => {
        for (let name of tableNames) {
            const value = await connection.query(`SHOW COLUMNS FROM ??`, [name]);
            tableAttributes[name] = value[0].map(element => element.Field);
        }
    }).catch(() => {
        return false;
    });

    return tableAttributes;
}

//Gets all the attributes of the table given, returns an array of attributes as the value
async function getTableAttributes(name) {
    console.log("getting attributes of table: %s", name);
    return await withDB(async (connection) => {
        return await connection.query(`SHOW COLUMNS FROM ??`, [name]);
    }).catch(() => {
        return false;
    });
}

async function testDBConnection() {
    return await withDB((connection) => {
        return true;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withDB(async (connection) => {
        return await connection.query('SELECT * from Player')
    });
};


async function insertDemotable(id, name) {
    return await withDB(async (connection) => {
        const [result, nothing] = await connection.execute(
            'INSERT INTO Player (id, name) VALUES (?, ?)',
            [id, name]);
        return result.affectedRows && result.affectedRows > 0;
    }).catch((err) => {
        console.log(err);
        return false, sqlMessage;
    });
}

async function addGuild(playerID, guildID) {
    return await withDB(async (connection) => {
        const [result, nothing] = await connection.query(
            'UPDATE Player SET GuildID = ? where ID = ?',
            [guildID, playerID]);
        console.log(result);
        return result.affectedRows && result.affectedRows > 0;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

async function addStatus(playerID, LV) {
    console.log("adding status: %d, %s", playerID, LV);
    return await withDB(async (connection) => {
        const [result, nothing] = await connection.query(
            'UPDATE Player SET LV = ? where ID = ?',
            [LV, playerID]);
        console.log(result);
        return result.affectedRows && result.affectedRows > 0;
    }).catch(() => {
        return false;
    });
}

async function performProjection(tableName, selectedOptions) {
    console.log("projecting: SELECT %s FROM %s", selectedOptions, tableName);
    return await withDB(async (connection) => {
        return await connection.query(
            'SELECT ?? FROM ??',
            [selectedOptions, tableName]);
    }).catch(() => {
        return false;
    });
}


async function updateNameDemotable(ID, newName) {
    return await withDB(async (connection) => {
        const [result, nothing] = await connection.execute(
            'UPDATE Player SET Name = ? where ID = ?',
            [newName, ID]);

        return result.affectedRows && result.affectedRows > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    console.log("counting players");
    return await withDB(async (connection) => {
        const result = await connection.query('SELECT Count(*) FROM Player');
        console.log(result);
        return result;
    }).catch(() => {
        return -1;
    });
}

async function deletePlayer(id) {
    return await withDB(async (connection) => {
        const [result, nothing] = await connection.execute(
            'DELETE FROM Player WHERE ID = ?',
            [id]
        );

        return result.affectedRows && result.affectedRows > 0;
    }).catch(() => {
        return false;
    });
}



async function fetchInventory() {
    return await withDB(async (connection) => {
        const result = await connection.query('SELECT * FROM InventoryObject');
        return result;
    }).catch(() => {
        return false;
    });
}

// function that queries an sql statement and returns the result
async function simpleTableQuery(query) {
    return await withDB(async (connection) => {
        const result = await connection.query(query);
        return result;
    }).catch(() => {
        return false;
    });
}

async function joinWhere(id) {
    console.log("joining where id = ", id);
    return await withDB(async (connection) => {
        const result = await connection.query(`
            SELECT Player.Name FROM Player 
            INNER JOIN InventoryRecord ON Player.ID = InventoryRecord.PlayerID
            WHERE InventoryRecord.InventoryID = 1;`,
            [id]);
        return result;
    }).catch(() => {
        return false;
    });
}

async function select(andOrArray, attributeValueArray) {
    var query = "SELECT * FROM Player WHERE ?? = ?";
    if (andOrArray)
        andOrArray.forEach(element => {
            //extra precaustion against injects
            if (element == "AND") {
                query += " " + element + " ?? = ? ";
            }
            if (element == "OR") {
                query += " " + element + " ?? = ? ";
            }
        });

    query += ";";
    return await withDB(async (connection) => {
        console.log(connection.format(query, attributeValueArray));
        const result = await connection.query(query, attributeValueArray);
        return result;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testDBConnection,
    fetchDemotableFromDb,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    deletePlayer,
    addGuild,
    addStatus,
    fetchInventory,
    performProjection,
    getAllTableNames,
    getAllTableAttributes,
    getTableAttributes,
    simpleTableQuery,
    joinWhere,
    select
};