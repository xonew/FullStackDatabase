const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testDBConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.put('/projection', async (req, res) => {
    const { table_name, attributes } = req.body;

    const tableContent = await appService.performProjection(table_name, attributes);

    res.json({ data: tableContent });
});

router.get('/inventorytable', async (req, res) => {
    const tableContent = await appService.fetchInventory();
    res.json({data: tableContent});
});


router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-inventory", async (req, res) => {
    const initiateResult = await appService.initiateInventory();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name, lv, guildID } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { ID, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(ID, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-guild", async (req, res) => {
    const { playerID, guildID } = req.body;
    const updateGuild = await appService.addGuild(playerID, guildID);
    if (updateGuild) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/add-status", async (req, res) => {
    const { playerID, LV } = req.body;
    const updateStatus = await appService.addStatus(playerID, LV);
    if (updateStatus) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

router.post("/delete-player", async (req, res) => {
    const { id } = req.body;
    const deleteResult = await appService.deletePlayer(id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;