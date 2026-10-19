import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import callsRouter from './routes/calls.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'On-Ground.ai Call Center API',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Calling API Routes
app.use('/api/calls', callsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌿 On-Ground.ai Call Center Server running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📞 Calling Endpoint: http://localhost:${PORT}/api/calls/initiate`);
  console.log(`=======================================================`);
});
