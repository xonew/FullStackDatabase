const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testDBConnection();
    console.log("ping")
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    console.log("fetch player request")
    res.json({ data: tableContent });
});



router.get('/inventorytable', async (req, res) => {
    const tableContent = await appService.fetchInventory();
    console.log("fetch inventory request")
    res.json({ data: tableContent });
});



router.post("/get-all", async (req, res) => {
    const result = await appService.getAllTableNames();
    const tableNames = result[0].map(element =>
        element.Tables_in_db);
    const tableAttributes = await appService.getAllTableAttributes(tableNames);
    res.json({ tableAttributes: tableAttributes });
});

router.post("/get-table-names", async (req, res) => {
    const result = await appService.getAllTableNames();
    const tableNames = result[0].map(element =>
        element.Tables_in_db);
    res.json({ tableNames: tableNames });
});


router.post("/get-attributes", async (req, res) => {
    const { name } = req.body;
    const result = await appService.getTableAttributes(name);
    fieldNames = result[0].map(element =>
        element.Field);
    res.json({ tableAttributes: fieldNames });
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    appService.insertDemotable(id, name).then((result) => {
        console.log("insert request: %d, %s, %s", id, name, result);
        res.json({ message: result });
    }).catch((error) => {
        console.error('An error occurred:', error.sqlMessage);
        res.status(500).json({ message: error.sqlMessage });
    });
});

router.post("/update-name-demotable", async (req, res) => {
    const { ID, newName } = req.body;
    appService.updateNameDemotable(ID, newName).then((result) => {
        console.log("update name request: %d, %s, %s", ID, newName, result);
        res.json({ message: result });
    }).catch((error) => {
        console.error('An error occurred:', error.sqlMessage);
        res.status(500).json({ message: error.sqlMessage });
    });
});

router.post("/add-guild", async (req, res) => {
    const { playerID, guildID } = req.body;
    appService.addGuild(playerID, guildID).then((result) => {
        console.log("guild join request: %d, %d, %s", playerID, guildID, result);
        res.json({ message: result });
    }).catch((error) => {
        console.error('An error occurred:', error.sqlMessage);
        res.status(500).json({ message: error.sqlMessage });
    });

});

router.post("/add-status", async (req, res) => {
    const { playerID, LV } = req.body;
    appService.addStatus(playerID, LV).then((result) => {
        console.log("status update request: %d, %d, %s", playerID, LV, result);
        res.json({ message: result });
    }).catch((error) => {
        console.error('An error occurred:', error.sqlMessage);
        res.status(500).json({ message: error.sqlMessage });
    });
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    console.log("table count: " + tableCount);
    if (tableCount) {
        res.json({
            success: true,
            count: tableCount[0][0]['Count(*)']
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount[0][0]['Count(*)']
        });
    }
});

router.post("/delete-player", async (req, res) => {
    const { id } = req.body;
    appService.deletePlayer(id).then((result) => {
        console.log("delete player request: " + id);
        res.json({ message: result });
    }).catch((error) => {
        console.error('An error occurred:', error.sqlMessage);
        res.status(500).json({ message: error.sqlMessage });
    });
});


router.post('/select', async (req, res) => {
    console.log(req.body);
    const { andOrArray, attributeValueArray } = req.body;
    const tableContent = await appService.select(andOrArray, attributeValueArray);
    res.json({ data: tableContent });
});

router.post('/projection', async (req, res) => {
    const { table_name, attributes } = req.body;
    console.log("projection request: %s, %s", table_name, attributes)
    const tableContent = await appService.performProjection(table_name, attributes);
    res.json({ data: tableContent });
});

const queries = {
    'aggGroupByTable': `
        SELECT g.Lv as GuildLevel, sum(p.Lv) as TotalLv
        FROM Player p
        inner Join Guild g on p.GuildID = g.ID
        GRoup By g.Lv        
        `,
    'aggNestedTable': `
        SELECT GuildID, Guild.Name, COUNT(*), avg(Player.Lv)
        FROM Player
        INNER JOIN Guild ON Player.GuildID = Guild.ID
        GROUP BY GuildID
        having sum(Player.Lv) > (SELECT max(Player.Lv)
        FROM Player);
        `,

    'divisionTable': `
    SELECT p.ID, p.Name
    FROM Player AS p
    WHERE NOT EXISTS (
        SELECT q.ID
        FROM Quest AS q
        WHERE NOT EXISTS (
            SELECT qr.QuestID
            FROM QuestRecord AS qr
            WHERE qr.PlayerID = p.ID AND qr.QuestID = q.ID
        )
    );
    `,
    'aggHavingTable': `SELECT ir.PlayerID, p.Name
    FROM InventoryRecord AS ir
    JOIN Player AS p ON ir.PlayerID = p.ID
    GROUP BY ir.PlayerID, p.Name
    HAVING COUNT(DISTINCT ir.InventoryID) > 5;`

}

router.post("/simple-table-query", async (req, res) => {
    const { table } = req.body;
    const tableContent = await appService.simpleTableQuery(queries[table]);
    res.json({ data: tableContent });
});

router.post("/join-where", async (req, res) => {
    const { ID } = req.body;
    const tableContent = await appService.joinWhere(ID);
    res.json({ data: tableContent });
});




module.exports = router;