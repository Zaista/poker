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
function addScore(name, score) {
    return __awaiter(this, void 0, void 0, function* () {
        const newScore = new Score_1.ScoreModel({
            name: name,
            score: score,
        });
        try {
            const score_1 = yield newScore.save();
            console.log("User saved successfully:", score_1);
        }
        catch (error) {
            console.error("Error saving user:", error);
        }
    });
}
function listScores() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield Score_1.ScoreModel.find({});
        }
        catch (error) {
            console.error("Error fetching score:", error);
            return [];
        }
    });
}
