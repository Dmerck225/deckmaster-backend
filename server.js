const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/"); // Store images in the public/images folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to avoid name conflicts
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images are allowed."));
        }
    }
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://heavymentaldlm:xmM6KldMyMVmhcHz@carddata.bzqqr.mongodb.net/?retryWrites=true&w=majority&appName=CardData", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));

// Define the Card schema and model
const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cardType: { type: String, required: true },
    rarity: { type: String, required: true },
    description: { type: String, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    abilities: { type: [String], required: true },
    img_name: { type: String, required: true }  // This will store the relative image path or URL
});

const Card = mongoose.model("Card", cardSchema);

// Joi validation schema
const validateCard = (card) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        cardType: Joi.string().required(),
        rarity: Joi.string().required(),
        description: Joi.string().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        abilities: Joi.array().items(Joi.string()).required(),
        img_name: Joi.string().required()  // No need for URI validation since image path is saved
    });
    return schema.validate(card);
};

// GET all cards
app.get("/api/cards", async (req, res) => {
    const cards = await Card.find();
    res.json(cards);
});

// POST a new card with image upload
app.post("/api/cards", upload.single("imgFile"), async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let cardData = req.body;

    if (req.file) {
        // If an image is uploaded, store the relative image path
        cardData.img_name = `images/${req.file.filename}`;
    }

    const card = new Card(cardData);
    await card.save();
    res.status(201).json(card);
});

// PUT (edit) a card
app.put("/api/cards/:id", upload.single("imgFile"), async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let cardData = req.body;

    // If a new image is uploaded, update the image path
    if (req.file) {
        cardData.img_name = `images/${req.file.filename}`;
    }

    const card = await Card.findByIdAndUpdate(req.params.id, cardData, { new: true });
    if (!card) return res.status(404).send("Card not found");

    res.json(card);
});

// DELETE a card
app.delete("/api/cards/:id", async (req, res) => {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).send("Card not found");

    res.status(200).send("Card deleted successfully");
});

// Serve images from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
