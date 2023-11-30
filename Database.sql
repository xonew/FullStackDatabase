SET FOREIGN_KEY_CHECKS = 0; 
DROP TABLE IF EXISTS Guild;
DROP TABLE IF EXISTS Status;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS InventoryRecord;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS Quest;
-- TRUNCATE Guild;
-- TRUNCATE Status;
-- TRUNCATE Player;
-- TRUNCATE InventoryRecord;
-- TRUNCATE Inventory;
-- TRUNCATE Equipment;
-- TRUNCATE Item;
-- TRUNCATE Quest;
-- TRUNCATE QuestRecord;
SET FOREIGN_KEY_CHECKS = 1; 
-- GRANT ALL ON db.* TO 'username'@'%';

CREATE TABLE Status (
    Lv INT PRIMARY KEY,
    HP INT,
    MY INT,
    ATK INT
);

-- add constraint that guilds must have at least one player
CREATE TABLE Guild (
    ID INT PRIMARY KEY,
    LV INT,
    Name VARCHAR(50)
);

CREATE TABLE Player (
    ID          INT PRIMARY KEY,
    Name        VARCHAR(20),
    Lv    INT,
    GuildID    INT,
    FOREIGN KEY (GuildID) REFERENCES Guild(ID) ON DELETE CASCADE,
    FOREIGN KEY (Lv) REFERENCES Status(Lv) ON DELETE CASCADE
);

    
-- this should not have stats and also shouldnt have a type
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY,
    Name VARCHAR(50),
    Type VARCHAR(50),
    HP_plus INT,
    MP_plus INT,
    ATK_plus INT
);

CREATE TABLE InventoryRecord (
    InventoryID INT,
    PlayerID INT,
    Quantity INT,
    PRIMARY KEY (InventoryID, PlayerID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(InventoryID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Player(ID) ON DELETE CASCADE
);


-- this should have stats
CREATE TABLE Equipment (
    EquipmentID INT PRIMARY KEY,
    FOREIGN KEY (EquipmentID) REFERENCES Inventory(InventoryID)
);

-- this should have a quantity
CREATE TABLE Item (
    ItemID INT not null REFERENCES Inventory(InventoryID),
    PRIMARY KEY(ItemID)
);

CREATE TABLE Quest (
    ID INT PRIMARY KEY,
    Name VARCHAR(50)
);

-- this should have a number of times cleared column
CREATE TABLE QuestRecord (
    QuestID INT,
    PlayerID INT,
    FOREIGN KEY (QuestID) REFERENCES Quest(ID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Player(ID) ON DELETE CASCADE
);



INSERT INTO Inventory VALUES (1, 'Aquila Favonia', 'Equipment', 1000, 0, 0);
INSERT INTO Equipment VALUES (1);

INSERT INTO Inventory VALUES (2, 'Dull Blade', 'Equipment', 0, 0, 0);
INSERT INTO Equipment VALUES (2);

INSERT INTO Inventory VALUES (3, 'Hanatsuki Paddle', 'Equipment', 100, 0, 0);
INSERT INTO Equipment VALUES (3);

INSERT INTO Inventory VALUES (4, 'Rusty Sickle', 'Equipment', 10, 0, 0);
INSERT INTO Equipment VALUES (4);

INSERT INTO Inventory VALUES (5, 'Jotunheim', 'Equipment', 5000, 0, 0);
INSERT INTO Equipment VALUES (5);

INSERT INTO Inventory VALUES (6, 'Jar', 'Item', 0, 0, 0);
INSERT INTO Equipment VALUES (6);

INSERT INTO Inventory VALUES (7, 'Stick', 'Equipment', 0, 0, 0);
INSERT INTO Equipment VALUES (7);

INSERT INTO Inventory VALUES (8, 'Excalibur', 'Equipment', 1500, 0, 50);
INSERT INTO Equipment VALUES (8);

INSERT INTO Inventory VALUES (9, 'Healing Potion', 'Item', 0, 50, 0);
INSERT INTO Item VALUES (9);

INSERT INTO Inventory VALUES (10, 'Thunder Staff', 'Equipment', 500, 100, 30);
INSERT INTO Equipment VALUES (10);

INSERT INTO Inventory VALUES (11, 'Invisibility Cloak', 'Item', 0, 0, 0);
INSERT INTO Item VALUES (11);

INSERT INTO Inventory VALUES (12, 'Fireball Scroll', 'Item', 0, 20, 0);
INSERT INTO Item VALUES (12);

INSERT INTO Inventory VALUES (13, 'Diamond Shield', 'Equipment', 2000, 0, 20);
INSERT INTO Equipment VALUES (13);

INSERT INTO Inventory VALUES (14, 'Health Elixir', 'Item', 100, 0, 0);
INSERT INTO Item VALUES (14);



INSERT INTO Quest VALUES (1, 'Echoes of the Forgotten Realm');
INSERT INTO Quest VALUES (2, 'Whispers in the Enchanted Woods');
INSERT INTO Quest VALUES (3, 'Serpent Lair Mystery');
INSERT INTO Quest VALUES (4, 'The Crystal Cavern Expedition');
INSERT INTO Quest VALUES (5, 'Shadows Over Sunhaven');
INSERT INTO Quest VALUES (6, 'Riddle of the Lost Crypt');
INSERT INTO Quest VALUES (7, 'Moonlit Mirage Conundrum');
INSERT INTO Quest VALUES (8, 'Secrets of the Celestial Garden');
INSERT INTO Quest VALUES (9, 'The Ebonfire Ritual');
INSERT INTO Quest VALUES (10, 'Enigma of the Astral Isles');


INSERT INTO Guild VALUES (1, 10, 'Eternal Eclipse Syndicate');
INSERT INTO Guild VALUES (2, 10, 'Whispering Shadows Alliance');
INSERT INTO Guild VALUES (3, 15, 'Sapphire Serpent Society');
INSERT INTO Guild VALUES (4, 25, 'Celestial Vanguard');
INSERT INTO Guild VALUES (5, 18, 'Golden Griffin Brotherhood');
INSERT INTO Guild VALUES (6, 30, 'Radiant Rose Coalition');
INSERT INTO Guild VALUES (7, 22, 'Silent Storm Union');
INSERT INTO Guild VALUES (8, 12, 'Lunar Phoenix Clan');
INSERT INTO Guild VALUES (9, 28, 'Iron Crown Syndicate');
INSERT INTO Guild VALUES (10, 17, 'Ember Wolf Pack');


INSERT INTO Status VALUES (1, 10, 10, 10);
INSERT INTO Status VALUES (2, 15, 15, 15);
INSERT INTO Status VALUES (3, 20, 20, 20);
INSERT INTO Status VALUES (4, 25, 25, 25);
INSERT INTO Status VALUES (5, 30, 30, 30);
INSERT INTO Status VALUES (6, 35, 35, 35);
INSERT INTO Status VALUES (7, 40, 40, 40);
INSERT INTO Status VALUES (8, 45, 45, 45);
INSERT INTO Status VALUES (9, 50, 50, 50);
INSERT INTO Status VALUES (10, 55, 55, 55);

INSERT INTO Player (ID, Name, Lv, GuildID) VALUES (1, 'DragonSlayer01', 1, 1);
INSERT INTO Player (ID, Name, Lv, GuildID) VALUES (2, 'PixelKnight', 2, 1);
INSERT INTO Player (ID, Name, Lv, GuildID) VALUES (3, 'StealthArcher', 3, 2);
INSERT INTO Player (ID, Name, Lv, GuildID) VALUES (4, 'ArcaneWizard', 4, 2);
INSERT INTO Player (ID, Name, Lv, GuildID) VALUES (5, '727', 5, 3);

INSERT INTO InventoryRecord (InventoryID, PlayerID, Quantity) VALUES (1, 1, 10);
INSERT INTO InventoryRecord (InventoryID, PlayerID, Quantity) VALUES (2, 2, 15);
INSERT INTO InventoryRecord (InventoryID, PlayerID, Quantity) VALUES (3, 3, 20);
INSERT INTO InventoryRecord (InventoryID, PlayerID, Quantity) VALUES (4, 4, 25);
INSERT INTO InventoryRecord (InventoryID, PlayerID, Quantity) VALUES (5, 5, 30);