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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const score_1 = require("./score");
const logger_1 = require("./logger");
const log = (0, logger_1.getLogger)('app');
if (process.env.profile !== 'production') {
    log.debug('Environment variables loaded from the .env file');
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
app.use(express_1.default.static('./public', { redirect: false }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' })); // for parsing application/x-www-form-urlencoded
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: '.' });
});
app.get('/score', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scores = yield (0, score_1.listScores)();
        res.json(scores);
    }
    catch (error) {
        log.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.post('/score', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, score_1.addScore)(req.body.name, req.body.score);
    res.send({ success: 'Score submitted.' });
}));
// Listen to the App Engine-specified port, or 3000 otherwise
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    log.info('Server running on port 3000');
});
const uri = process.env.mongodbUri;
mongoose_1.default
    .connect(uri)
    .then(() => log.info('MongoDB connected'))
    .catch((err) => log.error('MongoDB connection error:', err));
