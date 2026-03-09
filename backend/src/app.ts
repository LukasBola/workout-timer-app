import express from 'express';
import cors from 'cors';
import presetsRouter from './routes/presets';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/presets', presetsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
