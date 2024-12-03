const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");  // Importing uuid for generating unique IDs

// Enable Cross-Origin Request Sharing (CORS)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory "database" for cards
let cards = [
    {
        _id: "1", 
        name: "Shadow Assassin", 
        cardType: "Monster", 
        rarity: "Epic", 
        description: "A stealthy and powerful assassin.",
        attack: 2500, 
        defense: 1500, 
        abilities: ["Stealth", "Backstab"], 
        img_name: "https://place-hold.it/150x200"
    },
    {
        _id: "2", 
        name: "Thunder Golem", 
        cardType: "Monster", 
        rarity: "Rare", 
        description: "A giant golem infused with the power of lightning.",
        attack: 2000, 
        defense: 1800, 
        abilities: ["Lightning Strike"], 
        img_name: "https://place-hold.it/150x200"
    },
    {
        _id: "3", 
        name: "Crimson Knight",
        cardType: "Creature",
        rarity: "Epic",
        description: "A warrior fueled by bloodlust, the Crimson Knight grows stronger with each victory in battle.",
        attack: 200,
        defense: 180,
        abilities: [
            "Blood Frenzy: Gains +10 attack every time it destroys a creature.",
            "Crimson Shield: Reduces damage from melee attacks by 25%.",
        ],
        img_name: "images/crimson-khight.jpeg",
    },
    {
        _id: "4", 
        name: "Void Walker",
        cardType: "Creature",
        rarity: "Epic",
        description: "A mysterious entity from another dimension, the Void Walker uses teleportation and soul manipulation to outwit its foes.",
        attack: 170,
        defense: 150,
        abilities: [
            "Void Shift: Can teleport out of combat, avoiding one attack per game.",
            "Soul Drain: Drains 30 health from an enemy creature, healing Void Walker by the same amount.",
        ],
        img_name: "images/void-walker.jpeg",
    },
    {
        _id: "5", 
        name: "Ice Queen",
        cardType: "Creature",
        rarity: "Legendary",
        description: "Ruling over the frozen tundra, the Ice Queen commands icy winds and frost to freeze her enemies in their tracks.",
        attack: 160,
        defense: 220,
        abilities: [
            "Frozen Touch: Freezes an enemy creature, preventing it from attacking for one turn.",
            "Blizzard Call: Deals 40 damage to all enemies and reduces their attack by 10 for two turns.",
        ],
        img_name: "images/ice-queen.jpeg",
    },
    {
        _id: "6", 
        name: "Storm Elemental",
        cardType: "Creature",
        rarity: "Rare",
        description: "An embodiment of the storm, the Storm Elemental unleashes powerful gales and electrical surges to devastate opponents.",
        attack: 150,
        defense: 130,
        abilities: [
            "Gale Force: Pushes an enemy back, delaying its attack by one turn.",
            "Storm Field: Creates a storm for 3 turns, reducing all enemy defense by 10%.",
        ],
        img_name: "images/storm-elemental.jpeg",
    },
    {
        _id: "7", 
        name: "Necromancer",
        cardType: "Creature",
        rarity: "Rare",
        description: "A master of the dark arts, the Necromancer harnesses the power of death to manipulate the undead.",
        attack: 180,
        defense: 180,
        abilities: [
            "Raise Dead: Revives one fallen ally creature with 50% health.",
            "Dark Pact: Sacrifices 50 health to deal 100 damage to an enemy."
        ],
        img_name: "images/Necromancer.jpeg",
    },
    {
        _id: "8", 
        name: "Phoenix Guardian",
        cardType: "Creature",
        rarity: "Legendary",
        description: "A celestial guardian, the Phoenix Guardian harnesses the power of fire to protect its allies.",
        attack: 190,
        defense: 170,
        abilities: [
            "Rebirth: Once per game, resurrects after being destroyed with half health.",
            "Flame Wings: Deals 50 damage to an enemy and burns them for 10 damage over time."
        ],
        img_name: "images/phoenix.jpeg",
    }
];

// Get all cards
app.get("/api/cards", (req, res) => {
    res.json(cards);
});

// Add a new card
app.post("/api/cards", (req, res) => {
    const { name, cardType, rarity, description, attack, defense, abilities, img_name } = req.body;

    // Generate a unique ID for the new card
    const newCard = {
        _id: uuidv4(),  // Use uuid to generate a truly unique ID
        name,
        cardType,
        rarity,
        description,
        attack,
        defense,
        abilities,
        img_name
    };

    cards.push(newCard);  // Add the new card to the "database"
    res.status(201).json(newCard);  // Respond with the new card, including the generated _id
});

// Edit an existing card
app.put("/api/cards/:id", (req, res) => {
    const cardId = req.params.id;
    const { name, cardType, rarity, description, attack, defense, abilities, img_name } = req.body;

    let card = cards.find(card => card._id === cardId);
    if (!card) {
        return res.status(404).send("Card not found");
    }

    // Update the card's properties
    card.name = name || card.name;
    card.cardType = cardType || card.cardType;
    card.rarity = rarity || card.rarity;
    card.description = description || card.description;
    card.attack = attack || card.attack;
    card.defense = defense || card.defense;
    card.abilities = abilities || card.abilities;
    card.img_name = img_name || card.img_name;

    res.json(card);  // Respond with the updated card
});

// Delete a card
app.delete("/api/cards/:id", (req, res) => {
    const cardId = req.params.id;
    const cardIndex = cards.findIndex(card => card._id === cardId);

    if (cardIndex === -1) {
        return res.status(404).send("Card not found");
    }

    cards.splice(cardIndex, 1);  // Remove the card from the "database"
    res.status(200).send("Card deleted successfully");
});

// Set up the server to listen on port 3000 (or your desired port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
