import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {addScore, listScores} from "./score";
import { getLogger } from './logger';

const log = getLogger('app');
if (process.env.profile !== 'production') {
    log.debug('Environment variables loaded from the .env file');
    dotenv.config();
}

const app = express();
app.use(express.static('./public', {redirect: false}));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '20mb'})); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.sendFile('public/index.html', {root: '.'});
});

app.get('/score', async (_req: Request, res: Response) => {
    try {
        const scores = await listScores()
        res.json(scores);
    } catch (error) {
        log.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/score', async (req: Request, res: Response) => {
    await addScore(req.body.name, req.body.score);
    res.send({success: 'Score submitted.'})
});

app.listen(3000, () => {
    log.info('Server running on port 3000');
});

const uri = process.env.mongodbUri as string
mongoose.connect(uri)
    .then(() => log.info("MongoDB connected"))
    .catch(err => log.error("MongoDB connection error:", err));
