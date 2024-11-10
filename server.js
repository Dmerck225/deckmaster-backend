const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));
const PORT = process.env.PORT || 3001;

// Sample data
let cards = [
    {
        _id: 1,
        name: "Shadow Assassin",
        cardType: "Creature",
        rarity: "Rare",
        description: "A master of stealth, the Shadow Assassin strikes from the shadows, bypassing defenses and evading attacks.",
        attack: 180,
        defense: 90,
        abilities: [
          "Stealth Strike: Shadow Assassin can attack directly, bypassing defenses, once per turn.",
          "Evasive Maneuver: Shadow Assassin has a 50% chance to completely avoid incoming attacks."
        ],
        img_name: "images/shadow-assasin.jpeg"
      },
      {
        _id: 2,
        name: "Thunder Golem",
        cardType: "Creature",
        rarity: "Legendary",
        description: "A towering colossus empowered by lightning, the Thunder Golem strikes down enemies with devastating electrical force.",
        attack: 220,
        defense: 200,
        abilities: [
          "ThunderStorm Blast:  Upon entering the battlefield, Thunder Golem deals 30 damage to all enemy creatures.",
          "Electric Shield: Reduces incoming damage by 20% from all sources. This move reflects the golem's natural defense, absorbing and dispersing energy from attacks."
        ],
        img_name: "images/thunder-golem.jpeg"
      },
      {
        _id: 3,
        name: "Crimson Knight",
        cardType: "Creature",
        rarity: "Epic",
        description: "A warrior fueled by bloodlust, the Crimson Knight grows stronger with each victory in battle.",
        attack: 200,
        defense: 180,
        abilities: [
          "Blood Frenzy: Gains +10 attack every time it destroys a creature.",
          "Crimson Shield: Reduces damage from melee attacks by 25%."
        ],
        img_name: "images/crimson-khight.jpeg"
      },
      {
        _id: 4,
        name: "Void Walker",
        cardType: "Creature",
        rarity: "Epic",
        description: "A mysterious entity from another dimension, the Void Walker uses teleportation and soul manipulation to outwit its foes.",
        attack: 170,
        defense: 150,
        abilities: [
          "Void Shift: Can teleport out of combat, avoiding one attack per game.",
          "Soul Drain: Drains 30 health from an enemy creature, healing Void Walker by the same amount."
        ],
        img_name: "images/void-walker.jpeg"
      },
      {
        _id: 5,
        name: "Ice Queen",
        cardType: "Creature",
        rarity: "Legendary",
        description: "Ruling over the frozen tundra, the Ice Queen commands icy winds and frost to freeze her enemies in their tracks.",
        attack: 160,
        defense: 220,
        abilities: [
          "Frozen Touch: Freezes an enemy creature, preventing it from attacking for one turn.",
          "Blizzard Call: Deals 40 damage to all enemies and reduces their attack by 10 for two turns."
        ],
        img_name: "images/ice-queen.jpeg"
      },
      {
        _id: 6,
        name: "Storm Elemental",
        cardType: "Creature",
        rarity: "Rare",
        description: "An embodiment of the storm, the Storm Elemental unleashes powerful gales and electrical surges to devastate opponents.",
        attack: 150,
        defense: 130,
        abilities: [
          "Gale Force: Pushes an enemy back, delaying its attack by one turn.",
          "Storm Field: Creates a storm for 3 turns, reducing all enemy defense by 10%."
        ],
        img_name: "images/storm-elemental.jpeg"
      },
      {
        _id: 7,
        name: "Necromancer",
        cardType: "Creature",
        rarity: "Epic",
        description: "A master of dark magic, the Necromancer can manipulate life and death, raising fallen allies and draining the life force of enemies.",
        attack: 160,
        defense: 140,
        abilities: [
          "Raise Dead: Revives one fallen ally creature with 50% health.",
          "Dark Pact: Sacrifices 50 health to deal 100 damage to an enemy."
        ],
        img_name: "images/Necromancer.jpeg"
      },
      {
        _id: 8,
        name: "Phoenix Guardian",
        cardType: "Creature",
        rarity: "Legendary",
        description: "The immortal Phoenix Guardian rises from the ashes, bringing fiery destruction to all who oppose it.",
        attack: 240,
        defense: 180,
        abilities: [
          "Rebirth: Once per game, resurrects after being destroyed with half health.",
          "Flame Wings: Deals 50 damage to an enemy and burns them for 10 damage over time."
        ],
        img_name: "images/phoenix.jpeg"
      }
];

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

app.get("/api/cards", (req, res) => {
    res.json(cards);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
