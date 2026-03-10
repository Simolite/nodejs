import express from "express";
import connectDB from "./conn.js";

const app = express();
const ipv4 = "192.168.1.189";
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = await connectDB();

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await db.collection("users").find().toArray();
        res.json(users);
    } catch {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// Get user by id
app.get("/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await db.collection("users").findOne({ id });

        if (user) res.json(user);
        else res.status(404).json({ error: "User not found" });

    } catch {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// Get prenom by id
app.get("/users/prenom/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await db.collection("users").findOne({ id });

        if (user) res.json({ prenom: user.prenom });
        else res.status(404).json({ error: "User not found" });

    } catch {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// Get DEV students
app.get("/users/fil/dev", async (req, res) => {
    try {
        const devUsers = await db
            .collection("users")
            .find({ filiere: "DEV" })
            .toArray();

        if (devUsers.length > 0) res.json(devUsers);
        else res.status(404).json({ error: "No DEV students found" });

    } catch {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// Get user by nom
app.get("/users/nom/:nom", async (req, res) => {
    try {
        const nom = req.params.nom;

        const user = await db.collection("users").findOne({ nom });

        if (user) res.json(user);
        else res.status(404).json({ error: "User not found" });

    } catch {
        res.status(500).json({ error: "Failed to read users" });
    }
});

// Update password
app.put("/users/pass/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const newPassword = req.body.password;

        if (!newPassword) {
            return res.status(400).json({ error: "Password is required" });
        }

        const result = await db.collection("users").updateOne(
            { id },
            { $set: { password: newPassword } }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json({ message: "Password updated successfully" });
        }

    } catch {
        res.status(500).json({ error: "Failed to update password" });
    }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await db.collection("users").deleteOne({ id });

        if (result.deletedCount === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json({ message: "User deleted successfully" });
        }

    } catch {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Add user
app.post("/users", async (req, res) => {
    try {
        const { nom, prenom, filiere, password } = req.body;

        const lastUser = await db
            .collection("users")
            .find()
            .sort({ id: -1 })
            .limit(1)
            .toArray();

        const newId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

        const newUser = {
            id: newId,
            nom,
            prenom,
            filiere,
            password
        };

        await db.collection("users").insertOne(newUser);

        res.json({ message: "User added successfully", user: newUser });

    } catch {
        res.status(500).json({ error: "Failed to add user" });
    }
});

app.listen(port, ipv4, () => {
    console.log(`Server running at http://${ipv4}:${port}`);
});