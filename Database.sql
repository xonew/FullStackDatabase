CREATE TABLE Player (
    ID          INT PRIMARY KEY,
    Name        VARCHAR(20),
    Guild       INT,
    StatusID    INT,
    GuildID    INT,
    FOREIGN KEY (StatusID) REFERENCES Status,
    FOREIGN KEY (GuildID) REFERENCES Guild
);

CREATE TABLE Status (
    StatusID INT PRIMARY KEY,
    PlayerID INT,
    LV INT,
    HP INT,
    MY INT,
    ATK INT,
    FOREIGN KEY (PlayerID) REFERENCES Player
);

CREATE TABLE Guild (
    ID INT PRIMARY KEY,
    LV INT,
    Name VARCHAR(20)
);

CREATE TABLE InventoryRecord (
    InventoryID INT,
    PlayerID INT
);

CREATE TABLE Inventory (
    InventoryID INT,
    Name VARCHAR(20),
    Type VARCHAR(20),
    HP_plus INT,
    MP_plus INT,
    ATK_plus INT
);

CREATE TABLE Equipment (
    EquipmentID VARCHAR(20) not null REFERENCES Inventory(InventoryID),
    PRIMARY KEY(EquipmentID)
);

CREATE TABLE Item (
    ItemID VARCHAR(20) not null REFERENCES Inventory(InventoryID),
    PRIMARY KEY(ItemID)
);

CREATE TABLE Quest (
    ID INT PRIMARY KEY,
    Name VARCHAR(20)
);

CREATE TABLE QuestRecord (
    QuestID INT,
    PlayerID INT,
    FOREIGN KEY (QuestID) REFERENCES Quest,
    FOREIGN KEY (PlayerID) REFERENCES Player
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