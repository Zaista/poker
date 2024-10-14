"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreModel = void 0;
const mongoose_1 = require("mongoose");
const ScoreSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
});
exports.ScoreModel = (0, mongoose_1.model)('Score', ScoreSchema);
