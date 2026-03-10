import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const ipv4 = "192.168.1.189", port = 5000;

app.use(express.json(), express.urlencoded({ extended: true }));

const db = (await new MongoClient("mongodb://127.0.0.1:27017").connect()).db("nodejs");
console.log("Connected to MongoDB");

// Get all users
app.get("/users", async (req, res) => res.json(await db.collection("users").find().toArray()));

// Get user by id
app.get("/users/:id", async (req, res) => {
    const user = await db.collection("users").findOne({ id: +req.params.id });
    res.json(user || { error: "User not found" });
});

// Get prenom by id
app.get("/users/prenom/:id", async (req, res) => {
    const user = await db.collection("users").findOne({ id: +req.params.id });
    res.json(user ? { prenom: user.prenom } : { error: "User not found" });
});

// Get DEV students
app.get("/users/fil/dev", async (req, res) => {
    const devs = await db.collection("users").find({ filiere: "DEV" }).toArray();
    res.json(devs.length ? devs : { error: "No DEV students found" });
});

// Get user by nom
app.get("/users/nom/:nom", async (req, res) => {
    const user = await db.collection("users").findOne({ nom: req.params.nom });
    res.json(user || { error: "User not found" });
});

// Update password
app.put("/users/pass/:id", async (req, res) => {
    if (!req.body.password) return res.status(400).json({ error: "Password is required" });
    const result = await db.collection("users").updateOne({ id: +req.params.id }, { $set: { password: req.body.password } });
    res.json(result.matchedCount ? { message: "Password updated successfully" } : { error: "User not found" });
});

// Delete user
app.delete("/users/:id", async (req, res) => {
    const result = await db.collection("users").deleteOne({ id: +req.params.id });
    res.json(result.deletedCount ? { message: "User deleted successfully" } : { error: "User not found" });
});

// Add user
app.post("/users", async (req, res) => {
    const { nom, prenom, filiere, password } = req.body;
    const last = await db.collection("users").find().sort({ id: -1 }).limit(1).toArray();
    const newUser = { id: last[0]?.id + 1 || 1, nom, prenom, filiere, password };
    await db.collection("users").insertOne(newUser);
    res.json({ message: "User added successfully", user: newUser });
});

app.listen(port, ipv4, () => console.log(`Server running at http://${ipv4}:${port}`));