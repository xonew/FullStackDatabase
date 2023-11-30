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

router.put('/projection', async (req, res) => {
    const { table_name, attributes } = req.body;
    console.log("projection request: %s, %s", table_name, attributes)
    const tableContent = await appService.performProjection(table_name, attributes);
    res.json({ data: tableContent });
});

router.get('/inventorytable', async (req, res) => {
    const tableContent = await appService.fetchInventory();
    console.log("fetch inventory request")
    res.json({ data: tableContent });
});



//later make this also get the collumns of each table
router.post("/get-all", async (req, res) => {
    const result = await appService.getAllTableNames();
    const tableNames = result[0].map(element =>
        element.Tables_in_db);
    const tableAttributes = await appService.getAllTableAttributes(tableNames);
    res.json({ tableAttributes: tableAttributes });
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    console.log("insert request: %d, %s, %s", id, name, insertResult);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { ID, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(ID, newName);
    console.log("update name request: %d, %s, %s", ID, newName, updateResult);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-guild", async (req, res) => {
    const { playerID, guildID } = req.body;
    const updateGuild = await appService.addGuild(playerID, guildID);
    console.log("guild join request: %d, %s, %s", playerID, guildID, updateGuild);
    if (updateGuild) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-status", async (req, res) => {
    const { playerID, LV } = req.body;
    const updateStatus = await appService.addStatus(playerID, LV);
    console.log("status update request: %d, %s, %s", playerID, LV, updateStatus);
    if (updateStatus) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
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
    const deleteResult = await appService.deletePlayer(id);
    console.log("delete player request: " + id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

const queries = {
    'aggGroupByTable': `
        SELECT g.Lv, sum(p.Lv)
        FROM Player p
        inner Join Guild g on p.GuildID = g.ID
        GRoup By g.Lv        
        `,
    'aggNestedTable': `
        SELECT GuildID, COUNT(*), avg(Player.Lv)
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



module.exports = router;