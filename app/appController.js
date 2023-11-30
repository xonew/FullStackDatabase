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
    res.json({data: tableContent});
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
    res.json({data: tableContent});
});


router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    console.log("initiate player request", initiateResult)
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-inventory", async (req, res) => {
    const initiateResult = await appService.initiateInventory();
    console.log("initiate inventory request", initiateResult);
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
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
    console.log("update name request: %d, %s, %s", id, newName, updateResult);
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

module.exports = router;