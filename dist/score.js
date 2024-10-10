"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addScore = addScore;
exports.listScores = listScores;
const Score_1 = require("./models/Score");
const logger_1 = require("./logger");
const log = (0, logger_1.getLogger)('score');
function addScore(name, score) {
    return __awaiter(this, void 0, void 0, function* () {
        const newScore = new Score_1.ScoreModel({
            name: name,
            score: score,
        });
        try {
            const score = yield newScore.save();
            log.info(`Score saved successfully: ${score.name} (${score.score})`);
        }
        catch (error) {
            log.error("Error saving user:", error);
        }
    });
}
function listScores() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield Score_1.ScoreModel.find({}).sort({ score: -1 });
        }
        catch (error) {
            log.error("Error fetching score:", error);
            return [];
        }
    });
}
