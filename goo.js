import express from "express"
import {MongoClient} from "mongodb"

const url = "mongodb://127.0.0.1:27017"
const dbname = "local"


export async function connectDB() {
    const client = new MongoClient(url);
    await client.connect();
    let db = client.db(dbname);
    console.log("Connected to MongoDB");
    return db;
}

let db = await connectDB()



const app = express()
app.use(express.json()) // Middleware

app.listen(5000, () => {
    console.log("Hello Express")
})

app.get("/", (req,res)=> {
    res.send("<h1>Welcome World!</h1>")
})

app.get("/equipes", async (req,res)=> {
    const users = await db.collection('equipes').find().toArray()
    res.json(users)
})

app.post("/equipes", (req,res)=> {
    equipes.push(req.body)
    res.json(equipes)
})
app.put("/equipes/:id", (req,res)=> {
    const id = parseInt(req.params.id)
    let equipe = equipes.find(equipe => equipe.id === id)
    equipe.name=req.body.name
    equipe.country=req.body.country
    res.json(equipe)
})
app.delete("/equipes/:id", (req,res)=> {
    const id = parseInt(req.params.id)
    let equipe = equipes.find(equipe => equipe.id === id)
    equipes.splice(equipes.indexOf(equipe),1)
    res.json(equipes)
})