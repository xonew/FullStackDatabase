CREATE TABLE Player (
    ID          INT PRIMARY KEY,
    Name        VARCHAR(20),
    "Level"     INT,
    JoinDate    DATE,
    LastLogin   DATE,
    Inventory1  INT,
    Guild       INT,
    FOREIGN KEY ("Level") REFERENCES PlayerStamina ("Level"),
    FOREIGN KEY (Inventory1) REFERENCES Inventory(ID)
);

CREATE TABLE PlayerStamina (
    "Level"     INT PRIMARY KEY,
    MaxStamina  INT
);

CREATE TABLE Quest (
    ID                  INT PRIMARY KEY,
    StaminaCost         INT,
    UnlockConditions    INT,
    Description         VARCHAR(20)
);

CREATE TABLE ClearedQuests (
    QuestId     INT,
    PlayerID    INT,
    PRIMARY KEY (QuestId, PlayerID),
    FOREIGN KEY (QuestId) REFERENCES Quest(ID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE Inventory (
    ID          INT PRIMARY KEY,
    Capacity    INT
);

CREATE TABLE PlayerInventories (
    PlayerID        INT,
    InventoryID     INT,
    PRIMARY KEY (PlayerID, InventoryID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID)
);

CREATE TABLE Skill (
    ID          INT PRIMARY KEY,
    Effect      VARCHAR(20),
    Modifier    INT
);

CREATE TABLE Character (
    ID      INT PRIMARY KEY,
    Name    VARCHAR(20) NOT NULL UNIQUE,
    Rarity  INT,
    Skill1  INT NOT NULL,
    FOREIGN KEY (Skill1) REFERENCES Skill(ID)
);

CREATE TABLE CharacterSkills (
    CharacterID     INT,
    SkillID         INT,
    PRIMARY KEY (CharacterID, SkillID),
    FOREIGN KEY (CharacterID) REFERENCES Character(ID),
    FOREIGN KEY (SkillID) REFERENCES Skill(ID)
);

CREATE TABLE Equipment (
    ID              INT PRIMARY KEY,
    Name            VARCHAR(20),
    PassiveEffect   VARCHAR(20),
    Stats           VARCHAR(20)
);

CREATE TABLE ActivableEquipment (
    EquipmentID     INT,
    SkillID         INT,
    Cooldown        INT,
    PRIMARY KEY (EquipmentID, SkillID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(ID),
    FOREIGN KEY (SkillID) REFERENCES Skill(ID)
);

CREATE TABLE EquipmentInventory (
    InventoryID     INT,
    Slots           INT,
    PRIMARY KEY (InventoryID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID)
);

CREATE TABLE StoredEquipment (
    EquipmentID     INT,
    InventoryID     INT,
    PRIMARY KEY (EquipmentID, InventoryID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(ID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID)
);

CREATE TABLE Item (
    ID              INT PRIMARY KEY,
    Description     VARCHAR(20),
    Value           INT
);

CREATE TABLE ItemInventory (
    InventoryID     INT,
    Currency        INT,
    PRIMARY KEY (InventoryID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID)
);

CREATE TABLE StoredItems (
    InventoryID     INT,
    ItemID          INT,
    Amount          INT,
    PRIMARY KEY (InventoryID, ItemID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID),
    FOREIGN KEY (ItemID) REFERENCES Item(ID)
);

CREATE TABLE CharacterInstance (
    CharacterID     INT,
    "Level"         INT,
    HP              INT,
    Str             INT,
    Def             INT,
    PRIMARY KEY (CharacterID, "Level"),
    FOREIGN KEY (CharacterID) REFERENCES Character(ID)
);

CREATE TABLE Team (
    PlayerID        INT,
    Name            VARCHAR(20),
    LastEdited      DATE,
    PRIMARY KEY (PlayerID, Name),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE Loadout (
    ID              INT,
    PlayerID        INT,
    CharacterID     INT,
    TeamName        VARCHAR(20),
    SkinID          INT,
    LastEdited      DATE,
    Equipped        INT,
    PRIMARY KEY (ID, CharacterID, TeamName),
    FOREIGN KEY (CharacterID) REFERENCES Character(ID),
    FOREIGN KEY (Equipped) REFERENCES Equipment(ID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE TeamMembers (
    PlayerID        INT,
    TeamName        VARCHAR(20),
    CharacterID     INT,
    LoadoutID       INT,
    PRIMARY KEY (PlayerID, TeamName, CharacterID, LoadoutID),
    FOREIGN KEY (CharacterID) REFERENCES Character(ID),
    FOREIGN KEY (LoadoutID) REFERENCES Loadout(ID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE LoadoutEquipment (
    LoadoutID       INT,
    CharacterID     INT,
    PlayerID        INT,
    TeamName        VARCHAR(20),
    EquipmentID     INT,
    PRIMARY KEY (PlayerID, LoadoutID, CharacterID, TeamName),
    FOREIGN KEY (LoadoutID) REFERENCES Loadout(ID),
    FOREIGN KEY (CharacterID) REFERENCES Character(ID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE Guild (
    ID                  INT PRIMARY KEY,
    DateRegistered      DATE,
    Leader              INT,
    FOREIGN KEY (Leader) REFERENCES Player(ID)
);

CREATE TABLE GuildMembers (
    GuildID     INT,
    PlayerID    INT,
    Role        INT,
    JoinDate    DATE,
    PRIMARY KEY (GuildID, PlayerID),
    FOREIGN KEY (GuildID) REFERENCES Guild(ID),
    FOREIGN KEY (PlayerID) REFERENCES Player(ID)
);

CREATE TABLE GuildInventories (
    GuildID         INT,
    InventoryID     INT,
    PRIMARY KEY (GuildID, InventoryID),
    FOREIGN KEY (GuildID) REFERENCES Guild(ID),
    FOREIGN KEY (InventoryID) REFERENCES Inventory(ID)
);


INSERT ALL
    INTO Player (ID, Name, "Level", JoinDate, LastLogin, Guild, Inventory1) VALUES (1001, 'Player1', 10, '2023-01-01', '2023-01-02', 1, 10)
    INTO Player (ID, Name, "Level", JoinDate, LastLogin, Guild, Inventory1) VALUES (1002, 'Player2', 0, '2023-01-02', '2023-01-03', 1, 20)
    INTO Player (ID, Name, "Level", JoinDate, LastLogin, Guild, Inventory1) VALUES (1003, 'Player3', 1, '2023-01-03', '2023-01-04', 2, 30)
    INTO Player (ID, Name, "Level", JoinDate, LastLogin, Guild, Inventory1) VALUES (1004, 'Player4', 2, '2023-01-04', '2023-01-05', NULL, 40)
    INTO Player (ID, Name, "Level", JoinDate, LastLogin, Guild, Inventory1) VALUES (1005, 'Player5', 3, '2023-01-05', '2023-01-06', 3, 50)
SELECT 1 FROM dual;

INSERT INTO PlayerStamina("Level", MaxStamina) VALUES (0, 10);
INSERT INTO PlayerStamina("Level", MaxStamina) VALUES (1, 15);
INSERT INTO PlayerStamina("Level", MaxStamina) VALUES (2, 20);
INSERT INTO PlayerStamina("Level", MaxStamina) VALUES (3, 25);
INSERT INTO PlayerStamina("Level", MaxStamina) VALUES (4, 30);

INSERT INTO Quest (ID, StaminaCost, UnlockConditions, Description) VALUES (1, 0, NULL, 'Tutorial');
INSERT INTO Quest (ID, StaminaCost, UnlockConditions, Description) VALUES (2, 0, 2, 'Prologue');
INSERT INTO Quest (ID, StaminaCost, UnlockConditions, Description) VALUES (3, 5, 3, 'Forest Entrance');
INSERT INTO Quest (ID, StaminaCost, UnlockConditions, Description) VALUES (4, 8, 4, 'Forest Clearing');
INSERT INTO Quest (ID, StaminaCost, UnlockConditions, Description) VALUES (5, 10, 5, 'Deep Forest');

INSERT ALL
    INTO ClearedQuests (QuestId, PlayerID) VALUES (1, 1001)
    INTO ClearedQuests (QuestId, PlayerID) VALUES (1, 1002)
    INTO ClearedQuests (QuestId, PlayerID) VALUES (1, 1003)
    INTO ClearedQuests (QuestId, PlayerID) VALUES (1, 1004)
    INTO ClearedQuests (QuestId, PlayerID) VALUES (1, 1005)
SELECT 1 FROM dual;

INSERT ALL
    INTO Inventory (ID, Capacity) VALUES (10, 100)
    INTO Inventory (ID, Capacity) VALUES (20, 50)
    INTO Inventory (ID, Capacity) VALUES (30, 50)
    INTO Inventory (ID, Capacity) VALUES (40, 50)
    INTO Inventory (ID, Capacity) VALUES (50, 50)
    INTO Inventory (ID, Capacity) VALUES (11, 100)
    INTO Inventory (ID, Capacity) VALUES (21, 50)
    INTO Inventory (ID, Capacity) VALUES (31, 50)
    INTO Inventory (ID, Capacity) VALUES (41, 50)
    INTO Inventory (ID, Capacity) VALUES (51, 50)
SELECT 1 FROM dual;

INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1001, 10);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1002, 20);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1003, 30);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1004, 40);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1005, 50);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1001, 11);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1002, 21);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1003, 31);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1004, 41);
INSERT INTO PlayerInventories (PlayerID, InventoryID) VALUES (1005, 51);

INSERT INTO Skill (ID, Effect, Modifier) VALUES (1, 'Basic Attack', 100);
INSERT INTO Skill (ID, Effect, Modifier) VALUES (2, 'Skill', 300);
INSERT INTO Skill (ID, Effect, Modifier) VALUES (3, 'Ultimate', 400);
INSERT INTO Skill (ID, Effect, Modifier) VALUES (4, 'Water Stream', 200);
INSERT INTO Skill (ID, Effect, Modifier) VALUES (5, 'Lapidus Domini', 600);

INSERT INTO Character (ID, Name, Rarity, Skill1) VALUES (1, 'Protagonist', 5, 1);
INSERT INTO Character (ID, Name, Rarity, Skill1) VALUES (2, 'Zhong', 3, 5);
INSERT INTO Character (ID, Name, Rarity, Skill1) VALUES (3, 'Luka', 4, 2);
INSERT INTO Character (ID, Name, Rarity, Skill1) VALUES (4, 'Mercury', 5, 4);
INSERT INTO Character (ID, Name, Rarity, Skill1) VALUES (5, 'Arc', 5, 3);

INSERT INTO CharacterSkills (CharacterID, SkillID) VALUES (1, 1);
INSERT INTO CharacterSkills (CharacterID, SkillID) VALUES (2, 5);
INSERT INTO CharacterSkills (CharacterID, SkillID) VALUES (3, 2);
INSERT INTO CharacterSkills (CharacterID, SkillID) VALUES (4, 4);
INSERT INTO CharacterSkills (CharacterID, SkillID) VALUES (5, 3);

INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (1, 'Aquila Favonia', 1000, 'Damage Reflect');
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (2, 'Dull Blade', 0, 'Fragile');
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (3, 'Hanatsuki Paddle', 100, 'Shield');
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (4, 'Rusty Sickle', 10, NULL);
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (5, 'Jotunheim', 5000, 'Endless Torrent');
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (6, 'Jar', 0, 'Fragile');
INSERT INTO Equipment (ID, Name, Stats, PassiveEffect) VALUES (7, 'Stick', 0, 'Fragile');

INSERT INTO ActivableEquipment(EquipmentID, Cooldown) VALUES (1, 30);
INSERT INTO ActivableEquipment(EquipmentID, Cooldown) VALUES (3, 30);
INSERT INTO ActivableEquipment(EquipmentID, Cooldown) VALUES (5, 15);
INSERT INTO ActivableEquipment(EquipmentID, Cooldown) VALUES (6, 0);
INSERT INTO ActivableEquipment(EquipmentID, Cooldown) VALUES (7, 0);

INSERT INTO StoredEquipment (EquipmentID, InventoryID) VALUES (11, 1);
INSERT INTO StoredEquipment (EquipmentID, InventoryID) VALUES (11, 2);
INSERT INTO StoredEquipment (EquipmentID, InventoryID) VALUES (11, 3);
INSERT INTO StoredEquipment (EquipmentID, InventoryID) VALUES (21, 1);
INSERT INTO StoredEquipment (EquipmentID, InventoryID) VALUES (31, 1);

INSERT INTO Item(ID, Description, Value) VALUES (1, 'Attorney’s Badge', 0);
INSERT INTO Item(ID, Description, Value) VALUES (2, 'Apple', 1);
INSERT INTO Item(ID, Description, Value) VALUES (3, 'Sus Steak', 0);
INSERT INTO Item(ID, Description, Value) VALUES (4, 'Emergency Rations', 100);
INSERT INTO Item(ID, Description, Value) VALUES (5, 'Small Gemstone', 5000);

INSERT INTO ItemInventory(InventoryID, Currency) VALUES (10, 1000);
INSERT INTO ItemInventory(InventoryID, Currency) VALUES (20, 1);
INSERT INTO ItemInventory(InventoryID, Currency) VALUES (30, 1);
INSERT INTO ItemInventory(InventoryID, Currency) VALUES (40, 1);
INSERT INTO ItemInventory(InventoryID, Currency) VALUES (50, 1);

INSERT INTO EquipmentInventory(InventoryID, Slots) VALUES (11, 1);
INSERT INTO EquipmentInventory(InventoryID, Slots) VALUES (21, 1);
INSERT INTO EquipmentInventory(InventoryID, Slots) VALUES (31, 1);
INSERT INTO EquipmentInventory(InventoryID, Slots) VALUES (41, 1);
INSERT INTO EquipmentInventory(InventoryID, Slots) VALUES (51, 1);

INSERT INTO StoredItems (InventoryID, ItemID, Amount) VALUES (10, 1, 1);
INSERT INTO StoredItems (InventoryID, ItemID, Amount) VALUES (10, 2, 10);
INSERT INTO StoredItems (InventoryID, ItemID, Amount) VALUES (10, 3, 1);
INSERT INTO StoredItems (InventoryID, ItemID, Amount) VALUES (20, 2, 20);
INSERT INTO StoredItems (InventoryID, ItemID, Amount) VALUES (30, 4, 1);

INSERT INTO CharacterInstance (CharacterID, "Level", HP, Str, Def) VALUES (1, 10, 1000, 100, 100);
INSERT INTO CharacterInstance (CharacterID, "Level", HP, Str, Def) VALUES (2, 20, 2000, 200, 200);
INSERT INTO CharacterInstance (CharacterID, "Level", HP, Str, Def) VALUES (3, 30, 3000, 300, 300);