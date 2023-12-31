/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}


// demotable, inventorytable
// Fetches data from the table and displays it.
async function fetchAndDisplayTable(elementId) {
    const response = await fetch('/' + elementId, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;
    displayTable(elementId, tableContent)
}

// tableContent is from .json().data
async function displayTable(elementId, tableContent) {
    try {
        const tableElement = document.getElementById(elementId);
        const tableBody = tableElement.querySelector('tbody');
        // Always clear old, already fetched data before new fetching process.
        if (tableBody) {
            tableBody.innerHTML = '';
        }
        const header = tableElement.querySelector('thead')
        if (header) {
            header.innerHTML = '';
        }
        const headerRow = header.insertRow();
        const [values, fields] = tableContent;
        fields.forEach(tuple => {
            headerRow.appendChild(document.createElement('th')).appendChild(document.createTextNode(tuple.name));
            //const headerCell = headerRow.insertCell();
            //headerCell.textContent = tuple.name;
        });
        // DemotableContent[0] has values, DemotableContent[1] has column names
        values.forEach(tuple => {
            const row = tableBody.insertRow();
            Object.keys(tuple).forEach((key, index) => {
                const cell = row.insertCell(index);
                cell.textContent = tuple[key];
            });
        });
    } catch (error) {
        console.error(error);
    }
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    console.log("resetting player table");
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "Playertable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');
    messageElement.textContent = responseData.message;
    fetchTableData();
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const playerID = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID: playerID,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');
    messageElement.textContent = responseData.message;
    fetchTableData();
}

// add Guild ID to a player in the player table.
async function addGuildIDtoPlayer(event) {
    event.preventDefault();

    const playerID = document.getElementById('targetPlayerIDtoAddGuild').value;
    const guildID = document.getElementById('targetGuildIDToBeAdded').value;

    const response = await fetch('/add-guild', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: playerID,
            guildID: guildID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addGuildIDtoPlayerMsg');
    messageElement.textContent = responseData.message;
    fetchTableData();
}

// add StatusLV to a player in the player table.
async function addStatusLVtoPlayer(event) {
    event.preventDefault();

    const playerID = document.getElementById('targetPlayerIDtoAddStatus').value;
    const StatusLV = document.getElementById('targetStatusLVToBeAdded').value;

    const response = await fetch('/add-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerID: playerID,
            LV: StatusLV
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('addStatusLVtoPlayerMsg');
    messageElement.textContent = responseData.message;
    fetchTableData();
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of players: ${tupleCount}`;
    } else {
        console.log(responseData);
        alert("Error in count demotable!");
    }
}

// Delete a specific player in the demotable.
async function deleteNamePlayertable(event) {
    event.preventDefault();

    const targetID = document.getElementById('deleteTargetID').value;

    const response = await fetch('/delete-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: targetID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteNameResultMsg');
    messageElement.textContent = responseData.message;
    fetchTableData();
}


// This function resets or initializes the demotable.
// async function loadInventorytable() {
//     const response = await fetch("/initiate-inventory", {
//         method: 'POST'
//     });
//     const responseData = await response.json();

//     if (responseData.success) {
//         const messageElement = document.getElementById('loadResultMsg');
//         messageElement.textContent = "Inventory loaded successfully!";
//         fetchTableData();
//     } else {
//         alert("Error loading table!");
//     }
// }


// Function to fill the dropdown lists
async function fillDropdownLists() {
    const tables = await getAllTableAttributes();
    const tableDropdown = document.getElementById("tableDropdown");
    const attributeDropdown = document.getElementById("attributeDropdown");
    for (const table in tables) {
        const option = document.createElement("option");
        option.value = table;
        option.text = table;
        tableDropdown.add(option);
    }

    tableDropdown.addEventListener("change", () => {
        const selectedTable = tableDropdown.value;
        const attributes = tables[selectedTable] || [];
        attributeDropdown.innerHTML = "";
        for (const attribute of attributes) {
            const option = document.createElement("option");
            option.value = attribute;
            option.text = attribute;
            attributeDropdown.add(option);
        }
        attributeDropdown.multiple = true;
    });
}


async function getAllTableAttributes() {
    const response = await fetch("/get-all", {
        method: "POST",
    });
    const responseData = await response.json();
    return responseData.tableAttributes;
}

async function getAttributes(tableName) {
    const response = await fetch('/get-attributes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: tableName,
        }),
    });
    const responseData = await response.json();
    return responseData.tableAttributes;
}

async function simpleTableQuery(table_name) {
    const response = await fetch('/simple-table-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            table: table_name,
        })
    });
    const responseData = await response.json();
    if (!responseData) {
        throw new Error(`Error retrieving ${table_name} table data!`);
    }
    displayTable(table_name, responseData.data);
}

async function aggGroupBy() {
    simpleTableQuery('aggGroupByTable');
}

async function aggNested() {
    simpleTableQuery('aggNestedTable')
}

async function division() {
    simpleTableQuery('divisionTable')
}

async function aggHaving() {
    simpleTableQuery('aggHavingTable')
}



async function joinWhere(event) {
    event.preventDefault();
    const targetID = document.getElementById('joinId').value;
    const response = await fetch("/join-where", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ID: targetID
        })
    });
    
    try {
        const responseData = await response.json();
        displayTable('joinWhereTable', responseData.data);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function displayProjectionTable() {
    const tableDropdown = document.getElementById("tableDropdown");
    const tableName = tableDropdown.options[tableDropdown.selectedIndex].value;
    const dropdown = document.getElementById("attributeDropdown");
    const selectedOptions = Array.from(dropdown.selectedOptions).map(
        (option) => option.value
    );

    if (selectedOptions.length > 0) {
        try {
            const tableData = await getProjectionTable(tableName, selectedOptions);
            displayTable("projectionTable", tableData)

        } catch (error) {
            console.error("Error:", error.message);
        }
    }
}


async function getProjectionTable(tableName, selectedOptions) {
    //const tableName = document.getElementById("tableDropdown").value;
    const dropdown = document.getElementById("attributeDropdown");
    //const selectedOptions = Array.from(dropdown.selectedOptions).map(
    //  (option) => option.value
    //);

    if (selectedOptions.length > 0) {
        try {
            const response = await fetch("/projection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    table_name: tableName,
                    attributes: selectedOptions,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error retrieving Projection table data!`);
            }
            const responseData = await response.json();
            const tableContent = responseData.data;
            return tableContent;
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
}


//function that creates three fields: two dropdowns and a text field
async function addSelectFields() {
    const attributes = await getAttributes("Player");
    const tableDropdown = document.getElementById("attribute0");
    attributes.map(element => {
        const option = document.createElement("option");
        option.value = element;
        option.text = element;
        tableDropdown.add(option);
        return option;
    })
    document.getElementById('addButton').addEventListener('click', () => {

        var newInputGroup = document.createElement('div');
        newInputGroup.className = 'inputGroup';


        var newAndOr = document.createElement('select');
        newAndOr.className = 'andOr';
        newAndOr.innerHTML = '<option value="AND">AND</option><option value="OR">OR</option>';
        newInputGroup.appendChild(newAndOr);



        var newAttribute = document.createElement('select');
        newAttribute.className = 'attribute';
        newInputGroup.appendChild(newAttribute);
        newAttribute.innerHTML = "";
        for (const attribute of attributes) {
            const option = document.createElement("option");
            option.value = attribute;
            option.text = attribute;
            newAttribute.add(option);
        }
        newInputGroup.appendChild(newAttribute);


        var newEquals = document.createElement('span');
        newEquals.textContent = 'is equal to';
        newInputGroup.appendChild(newEquals);


        var newValue = document.createElement('input');
        newValue.type = 'text';
        newValue.className = 'value';
        newInputGroup.appendChild(newValue);


        var newDeleteButton = document.createElement('button');
        newDeleteButton.textContent = 'Delete';
        newDeleteButton.className = 'deleteButton';
        newDeleteButton.addEventListener('click', function () {
            newInputGroup.remove();
        });
        newInputGroup.appendChild(newDeleteButton);


        document.getElementById('inputFields').appendChild(newInputGroup);
    });

    document.getElementById('submitButton').addEventListener('click', function () {

        var inputGroups = document.getElementsByClassName('inputGroup');
        var zero = document.getElementById('inputGroup0');

        var andOrArray = [];
        var attributeValueArray = [zero.getElementsByClassName('attribute')[0].value, zero.getElementsByClassName('value')[0].value];
        for (var i = 0; i < inputGroups.length; i++) {
            if (inputGroups[i].getElementsByClassName('andOr')[0].value) andOrArray.push(inputGroups[i].getElementsByClassName('andOr')[0].value);
            var attribute = inputGroups[i].getElementsByClassName('attribute')[0].value;
            var value = inputGroups[i].getElementsByClassName('value')[0].value;
            attributeValueArray.push(attribute);
            attributeValueArray.push(value);
        }
        displaySelectTable(andOrArray, attributeValueArray);
    });
}

async function displaySelectTable(andOrArray, attributeValueArray) {
    const response = await fetch("/select", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            andOrArray: andOrArray,
            attributeValueArray: attributeValueArray
        })
    });
    const responseData = await response.json();
    console.log(responseData);
    const tableContent = responseData.data;
    displayTable('selectTable', tableContent);
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fillDropdownLists();
    fetchTableData();
    addSelectFields();
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("deleteNamePlayertable").addEventListener("submit", deleteNamePlayertable);
    document.getElementById("addGuildIDtoPlayer").addEventListener("submit", addGuildIDtoPlayer);
    document.getElementById("addStatusLVtoPlayer").addEventListener("submit", addStatusLVtoPlayer);
    document.getElementById("displayProjectionTable").addEventListener("click", displayProjectionTable);
    document.getElementById("aggNested").addEventListener("click", aggNested);
    document.getElementById("aggGroupBy").addEventListener("click", aggGroupBy);
    document.getElementById("division").addEventListener("click", division);
    document.getElementById("aggHaving").addEventListener("click", aggHaving);
    document.getElementById("joinWhere").addEventListener("submit", joinWhere);
    document.getElementById("player-button").onclick = function () {
        const container = document.getElementById("player-container");
        (container.style.display == "none") ? container.style.display = "flex" : container.style.display = "none";
    };
};



// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayTable('demotable');
    //fetchAndDisplayTable('inventorytable');
    displayProjectionTable();
}