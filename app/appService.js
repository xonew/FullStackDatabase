const mySQL = require('mysql2/promise');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    host: envVariables.HOST,
    user: envVariables.USER,
    password: envVariables.PASSWORD,
    database: envVariables.DATABASE,
};

async function withDB(action) {
    let connection;
    try {
        console.log('Attempting to connect.');
        let db = await mySQL.createConnection(dbConfig);

        return action(db);

    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        if (connection) {
            connection.end((err) => {
                if (err) console.error(err);
            });
        }
    }
}



// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testDBConnection() {
    return await withDB((connection) => {
        return true;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withDB((connection) => {
        return connection.query('SELECT * from Inventory')
    });
};


async function initiateDemotable() {
    return await withDB(async (connection) => {
        connection.query(`DROP TABLE Player CASCADE CONSTRAINTS`, callbackErr)

        connection.query(`
            CREATE TABLE Player (
                id INT ,
                name VARCHAR(20),
                lv INT,
                guildID  INT,
                PRIMARY KEY (id)
            )
        `);
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withDB((connection) => {
        const result = connection.execute(
            'INSERT INTO Player (id, name) VALUES (?, ?)',
            [id, name]);
            console.log(result);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function addGuild(playerID, guildID) {
    return await withDB((connection) => {
        const result = connection.execute(
            'UPDATE Player SET GuildID = ? where ID = ?',
            [guildID, playerID]);
            console.log(result);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function addStatus(playerID, LV) {
    return await withDB((connection) => {
        const result = connection.execute(
            'UPDATE Player LV=? where PlayerID = ?',
            [LV, playerID]);
            console.log(result);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function performProjection(tableName, selectedOptions) {
    return await withDB((connection) => {
        const result = connection.execute(
            'SELECT ? FROM ?',
            [selectedOptions.join(', '), tableName]);
        console.log('projection');
        return result;
    }).catch(() => {
        return false;
    });
}


async function updateNameDemotable(ID, newName) {
    return await withDB((connection) => {
        const result = connection.execute(
            'UPDATE Player SET Name = ? where ID = ?',
            [newName, ID]);

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withDB((connection) => {
        const result = connection.query('SELECT Count(*) FROM Player');
        console.log(result);
        return result[0][0];
    }).catch(() => {
        return -1;
    });
}

async function deletePlayer(id) {
    return await withDB((connection) => {
        const result = connection.execute(
            'DELETE FROM Player WHERE ID = ?',
            [id]
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//Initiate Inventory
async function initiateInventory() {
    return await withDB((connection) => {
        try {
            connection.query('DROP TABLE Inventory')
        } catch (err) {
            if (err) {
                console.log('Table might not exist, proceeding to create...');
                console.log(connection.query(`select 'drop table ', table_name, 'cascade constraints;' from user_tables`));
                console.log(err);
            }
        };

        const result = connection.query(`
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
    return await withDB((connection) => {
        const result = connection.query('SELECT * FROM Inventory');
        return result;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    testDBConnection,
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