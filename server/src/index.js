import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRouter from './routes/health.js';
import gamesRouter from './routes/games.js';
import {notFound, errorHandler} from './middleware/errors.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', healthRouter);
app.use('/api/games', gamesRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});