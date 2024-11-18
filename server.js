const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Joi = require("joi");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("public")); // Serve static files (e.g., images)
app.use(express.json()); // Parse JSON payloads

// MongoDB Connection
mongoose
  .connect("mongodb+srv://heavymentaldlm:xmM6KldMyMVmhcHz@carddata.bzqqr.mongodb.net/?retryWrites=true&w=majority&appName=CardData", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Mongoose Schema and Model
const cardSchema = new mongoose.Schema({
  name: String,
  cardType: String,
  rarity: String,
  description: String,
  attack: Number,
  defense: Number,
  abilities: [String],
  img_name: String,
});

const Card = mongoose.model("Card", cardSchema);

// Joi Validation Schema
const cardValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  cardType: Joi.string().valid("Creature", "Spell", "Artifact").required(),
  rarity: Joi.string().valid("Common", "Rare", "Epic", "Legendary").required(),
  description: Joi.string().max(500).required(),
  attack: Joi.number().integer().min(0).required(),
  defense: Joi.number().integer().min(0).required(),
  abilities: Joi.array().items(Joi.string()).required(),
  img_name: Joi.string().uri().required(),
});

// Seed Data Function (Run Once to Populate Database)
async function seedCards() {
  const count = await Card.countDocuments();
  if (count === 0) {
    const cards = [
      {
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
        img_name: "images/shadow-assasin.jpeg",
      },
      {
        name: "Thunder Golem",
        cardType: "Creature",
        rarity: "Legendary",
        description: "A towering colossus empowered by lightning, the Thunder Golem strikes down enemies with devastating electrical force.",
        attack: 220,
        defense: 200,
        abilities: [
          "ThunderStorm Blast:  Upon entering the battlefield, Thunder Golem deals 30 damage to all enemy creatures.",
          "Electric Shield: Reduces incoming damage by 20% from all sources.",
        ],
        img_name: "images/thunder-golem.jpeg",
      },
      {
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
    await Card.insertMany(cards);
    console.log("Cards seeded successfully.");
  }
}
// Uncomment to seed the database (Run once, then comment it out again)
// seedCards();

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET: Fetch all cards
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find(); // Fetch all cards from MongoDB
    res.json(cards);
  } catch (err) {
    res.status(500).send("Error retrieving cards");
  }
});

// POST: Add a new card
app.post("/api/cards", async (req, res) => {
  // Validate the incoming data
  const { error } = cardValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Create a new card and save it to MongoDB
    const newCard = new Card(req.body);
    const savedCard = await newCard.save();
    res.status(201).json(savedCard); // Return the created card
  } catch (err) {
    res.status(500).send("Failed to add the card");
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
