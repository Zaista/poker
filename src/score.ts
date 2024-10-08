import { ScoreModel } from './models/Score';

export async function addScore(name: string, score: number) {
    const newScore = new ScoreModel({
        name: name,
        score: score,
    });

    try {
        const score_1 = await newScore.save();
        console.log("User saved successfully:", score_1);
    } catch (error) {
        console.error("Error saving user:", error);
    }
}

export async function listScores()  {
    try {
        return await ScoreModel.find({})
    } catch(error) {
        console.error("Error fetching score:", error);
        return []
    }
}
