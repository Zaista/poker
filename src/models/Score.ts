import { Schema, model } from 'mongoose'

interface Score extends Document {
  name: string
  score: number
}

const ScoreSchema = new Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
})

export const ScoreModel = model<Score>('Score', ScoreSchema)
