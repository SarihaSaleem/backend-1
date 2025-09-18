const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, "data", "recipes.json");

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Task 2: GET all recipes
app.get("/api/recipes", (req, res) => {
  fs.readFile(dataPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading recipes.json" });
    }
    try {
      const recipes = JSON.parse(data || "[]");
      res.json(recipes);
    } catch (parseError) {
      res.status(500).json({ error: "Invalid JSON format in recipes.json" });
    }
  });
});

// ✅ Task 1: POST new recipe
app.post("/api/recipes", (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  // Validate required fields
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "Title, ingredients, and instructions are required." });
  }

  fs.readFile(dataPath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading recipes.json" });

    let recipes = [];
    try {
      recipes = JSON.parse(data || "[]");
    } catch (parseError) {
      return res.status(500).json({ error: "Invalid JSON format in recipes.json" });
    }

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients,
      instructions,
      cookTime: cookTime || "N/A",
      difficulty: difficulty || "medium",
    };

    recipes.push(newRecipe);

    fs.writeFile(dataPath, JSON.stringify(recipes, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Error saving recipe" });
      res.status(201).json(newRecipe);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
