import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {addScore, listScores} from "./score";

dotenv.config();

const app = express();
app.use(express.static('./public', {redirect: false}));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '20mb'})); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.sendFile('public/index.html', {root: '.'});
});

type Score = {
    name: string
    score: number
}
app.get('/score', async (_req: Request, res: Response) => {
    try {
        const scores = await listScores()
        res.json(scores);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/score', async (req: Request, res: Response) => {
    const score = await addScore(req.body.name, req.body.score);
    console.log(score)
    res.send({success: 'Score submitted.'})
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

const uri = process.env.mongodbUri as string
console.log(uri)
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
