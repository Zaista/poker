import { ScoreModel } from './models/Score'
import { getLogger } from './logger'

const log = getLogger('score')
export async function addScore(name: string, score: number) {
  const newScore = new ScoreModel({
    name: name,
    score: score,
  })

  try {
    const score = await newScore.save()
    log.info(`Score saved successfully: ${score.name} (${score.score})`)
  } catch (error) {
    log.error('Error saving user:', error)
  }
}

export async function listScores() {
  try {
    return await ScoreModel.find({}).sort({ score: -1 })
  } catch (error) {
    log.error('Error fetching score:', error)
    return []
  }
}
